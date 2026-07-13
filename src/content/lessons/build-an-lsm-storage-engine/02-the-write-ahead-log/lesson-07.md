---
project: build-an-lsm-storage-engine
lesson: 7
title: A durable append
overview: This is the lesson the whole "crash-safe" promise rests on. Today you append a record to the write-ahead log and force it to disk with fsync, so that once an append returns, the data is durable even if the process dies the next instant.
goal: Append an encoded record to the log file and flush it to disk before returning.
spec:
  scenario: A record survives once the append returns
  status: failing
  lines:
    - kw: Given
      text: 'a fresh log file "wal.log"'
    - kw: When
      text: 'a record (Put, "apple", "red") is appended and the append call returns'
    - kw: Then
      text: opening the file with a completely separate reader and decoding it yields that record
    - kw: And
      text: 'appending a second record (Put, "banana", "yellow") leaves the file holding both records in append order'
code:
  lang: go
  source: |
    // open once, in append mode; each Append writes then fsyncs
    func (w *WAL) Append(kind Kind, key string, value []byte) error {
      // 1. write encodeRecord(...) to the file
      // 2. fsync so the bytes reach the physical disk, not just
      //    an OS buffer - THIS is what makes the write survive a crash
      return w.file.Sync()
    }
checkpoint: An appended record is on disk the moment Append returns, verifiable from a separate reader. Commit and stop here.
---

The **write-ahead log** (WAL) is a file the engine appends every write to *before*
touching anything else. It is the entire reason the engine is crash-safe: memory
is lost in a crash, but the log is on disk, so recovery can replay it. "On disk",
though, is stricter than it sounds - a normal write only hands bytes to the
operating system, which may hold them in a buffer for a while. A crash in that
window loses them.

**fsync** closes that window: it blocks until the bytes are physically persisted.
The rule an LSM engine lives by is *append to the log and fsync before
acknowledging the write* - after that point the data is safe no matter what
happens. Today's spec proves it the only honest way: a second, independent reader
opens the file and finds the record there, meaning it truly left the buffer, not
just your program's memory.
