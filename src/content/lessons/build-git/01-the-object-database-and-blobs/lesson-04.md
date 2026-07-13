---
project: build-git
lesson: 4
title: 'The fan-out storage path'
overview: 'Storing millions of objects in one flat directory would be slow, so Git splits an object''s id into a two-character subdirectory and a 38-character filename. Today you compute where an object lives on disk.'
goal: 'Turn an object id into its path inside the object database.'
spec:
  scenario: An id maps to a fan-out path
  status: failing
  lines:
    - kw: Given
      text: 'the object id ce013625030ba8dba906f756967f9e9ca394464a'
    - kw: When
      text: 'ObjectPath(id) is computed'
    - kw: Then
      text: 'it is objects/ce/013625030ba8dba906f756967f9e9ca394464a'
    - kw: And
      text: 'the first 2 hex characters are the directory and the remaining 38 are the filename'
code:
  lang: go
  source: |
    // split the 40-hex id into a 2-char dir and a 38-char name
    func ObjectPath(id string) string {
      return filepath.Join("objects", id[:2], id[2:])
    }
checkpoint: 'You can locate any object by its id. Commit and stop here.'
---

Git stores each loose object in a file named after its id, but it first carves
off the first two hex characters as a subdirectory. So `ce013625...` lives at
`objects/ce/013625...`. This **fan-out** spreads objects across 256 directories
(`00` through `ff`) so no single directory holds an unwieldy number of files.

It is a small, mechanical rule, but it is the bridge between an id and a real
file on disk. Every write we do from here on puts an object at this path, and
every read finds it here. Next lesson we finally write bytes: we compress the
serialized object and drop it at this location.
