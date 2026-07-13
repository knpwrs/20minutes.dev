---
project: build-an-lsm-storage-engine
lesson: 23
title: Deletes are tombstones
overview: You cannot erase a key from an immutable SSTable, so a delete has to be a write - a record that says "gone". Today you add Delete, which appends a tombstone record using the Delete kind you reserved in lesson 6.
goal: Implement Delete by writing a tombstone record to the WAL and memtable.
spec:
  scenario: A delete is recorded as a tombstone
  status: failing
  lines:
    - kw: Given
      text: 'a store holding Put("apple","red")'
    - kw: When
      text: 'Delete("apple") is called'
    - kw: Then
      text: 'a tombstone record (kind = Delete, key = "apple", no value) is appended to the WAL and placed in the memtable'
    - kw: And
      text: 'the memtable now holds "apple" as a tombstone entry, not as the value "red"'
code:
  lang: go
  source: |
    func (d *DB) Delete(key string) error {
      // WAL.Append(Delete, key, nil) first (durable), then put a
      // tombstone into the memtable for that key.
      // the memtable entry must record KIND, not just a value, so a
      // tombstone is distinguishable from a real value.
    }
checkpoint: Delete records a durable tombstone in the log and memtable. Commit and stop here.
---

Deleting from an LSM engine is counter-intuitive: you **write** to delete. SSTables
are immutable, so you cannot go remove a key from an old file - and even if you
could, an *older* SSTable might still hold a previous value that would then
resurface. The fix is a **tombstone**: a record marked `kind = Delete` that says
"as of now, this key is gone." It shadows every older value the same way a newer
`Put` shadows an older one.

This is the moment **kind** has to flow everywhere, not just live in the record
format: the memtable's entries carry it (a tombstone for `"apple"` is a real,
present entry that means *absence*), the iterators expose it, and a flush writes it
so a tombstone survives all the way to an SSTable. (Reserving the `Delete` kind back
in lesson 6 is what makes this a small change instead of a format break.) Wire the
tombstone through the same durable WAL path as any write - and have replay re-apply
it - so a delete survives a crash too. With the representation in place, the next
lessons just make reads and scans *honor* it.
