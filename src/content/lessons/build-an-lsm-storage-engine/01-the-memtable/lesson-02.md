---
project: build-an-lsm-storage-engine
lesson: 2
title: Put, Get, and overwrite
overview: A store you cannot write to is useless. Today you add Put so keys hold values, make a repeated Put overwrite the old value, and keep the entries sorted by key - the ordering the whole LSM design leans on.
goal: Store values by key, return them from Get, and have a second Put to the same key replace the first.
spec:
  scenario: Writing, reading, and overwriting a key
  status: failing
  lines:
    - kw: Given
      text: an empty store
    - kw: When
      text: 'Put("apple", "red") then Put("banana", "yellow") then Put("apple", "green") are called'
    - kw: Then
      text: 'Get("apple") returns "green" (found) and Get("banana") returns "yellow" (found)'
    - kw: And
      text: 'iterating the stored entries visits them in key order: "apple" before "banana"'
code:
  lang: go
  source: |
    // keep entries sorted by key so ordered reads are free later
    type entry struct { key string; value []byte }
    // find the insertion point with binary search; if the key is
    // already there, replace its value, else insert in place
    func (m *Memtable) Put(key string, value []byte) { /* ... */ }
checkpoint: The store holds values, overwrites on repeat, and keeps keys in sorted order. Commit and stop here.
---

The in-memory table that absorbs writes is the **memtable**. Its job is to hold
recent writes and answer reads for them. **Put** inserts a key's value; putting
the same key again **overwrites** it, because the newest write always wins - a
rule that will echo through every layer you build.

Crucially, the memtable keeps its keys **sorted**. An LSM engine flushes the
memtable to disk as a sorted file, merges sorted files, and scans ranges in
order - all of which are cheap only if the data is already ordered. Keeping the
entries sorted on every insert (find the spot, replace or splice in) means the
ordering you need for free reads is maintained from the start, not bolted on
later.
