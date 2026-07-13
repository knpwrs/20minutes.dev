---
project: build-an-lsm-storage-engine
lesson: 13
title: Iterating an SSTable
overview: A file full of records is only useful if you can walk it like anything else. Today you make an SSTable reader that implements the same Iterator interface as the memtable, so on-disk data plugs into every read path.
goal: Open an SSTable file and iterate its records in key order through the shared Iterator.
spec:
  scenario: Iterating an SSTable through the shared Iterator
  status: failing
  lines:
    - kw: Given
      text: 'an SSTable file written with records ("apple",...), ("banana",...), ("cherry",...)'
    - kw: When
      text: an SSTable iterator is opened and advanced from start to end
    - kw: Then
      text: 'it yields keys "apple", "banana", "cherry" in that order'
    - kw: And
      text: 'once past "cherry" it reports it is no longer valid, exactly like the memtable iterator does'
code:
  lang: go
  source: |
    // implement the Iterator interface from lesson 3 over file bytes
    func OpenSSTable(path string) (*SSTable, error) { /* read file */ }
    func (s *SSTable) Iterator() Iterator {
      // decode records lazily; Next() advances by the decoded
      // record length (the "n" from decodeRecord)
    }
checkpoint: An SSTable is walkable through the same Iterator the memtable uses. Commit and stop here.
---

The payoff of defining `Iterator` back in lesson 3 arrives now. An SSTable reader
decodes records left to right, exposing the same `Valid` / `Key` / `Value` /
`Next` cursor as the memtable. To the code above it, a memtable and an SSTable are
interchangeable **sources of sorted records** - which is exactly what the merge
iterator will need to read across memory and many files at once.

Advancing the cursor uses the **self-describing** record format: each decode tells
you how many bytes it consumed, so `Next` just moves the offset forward by that
amount to land on the following record. No separators, no index needed for a
straight walk - the format carries its own structure.
