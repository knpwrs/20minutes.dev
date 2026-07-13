---
project: build-an-lsm-storage-engine
lesson: 34
title: The public KV API
overview: A storage engine's users should never see memtables or SSTables. Today you settle the public surface - Open, Get, Put, Delete, Scan, Close - as one clean facade that hides every internal moving part.
goal: Expose a single DB type with Open, Get, Put, Delete, Scan, and Close as the only public API.
spec:
  scenario: Driving the store entirely through its public API
  status: failing
  lines:
    - kw: Given
      text: 'a DB opened on a directory via Open'
    - kw: When
      text: 'Put("apple","red"), Put("banana","yellow"), Delete("banana") are called, then Close'
    - kw: Then
      text: 'through the public API, Get("apple") returns "red" and Get("banana") is not-found'
    - kw: And
      text: 'Scan(["a","z")) yields only ("apple","red") - no internal types are needed to use the store'
code:
  lang: go
  source: |
    // the ONLY exported surface:
    type DB struct { /* memtable, levels, wal - all unexported */ }
    func Open(dir string) (*DB, error)
    func (d *DB) Get(key string) ([]byte, bool)
    func (d *DB) Put(key string, value []byte) error
    func (d *DB) Delete(key string) error
    func (d *DB) Scan(start, end string) Iterator
    func (d *DB) Close() error
checkpoint: The store is usable entirely through a small public API. Commit and stop here.
---

Everything so far has been internal machinery. A storage engine is a **library**,
and its value is the clean contract it offers the code that imports it: open a
directory, put and get and delete keys, scan ranges, close. Today you consolidate
that contract - **Open, Get, Put, Delete, Scan, Close** - and make sure nothing
below it leaks out. A user should never mention a memtable, an SSTable, or a
tombstone to use the store.

This is mostly a **facade** over methods you already have, but drawing the boundary
explicitly matters: it is what lets the internals keep changing - more levels,
better compaction, block compression - without breaking anyone. The remaining
lessons harden this surface against crashes: making `Open` rediscover on-disk
tables, `Close` shut down cleanly, and the whole thing survive a half-finished
write.
