---
project: build-git
lesson: 14
title: 'The staging index'
overview: 'Between your working files and a commit sits the index, Git''s staging area: a list of the paths you have marked to include next, each with a mode and a blob id. Today you build that in-memory structure.'
goal: 'Build an index that maps a path to its mode and blob id, and lists its paths in sorted order.'
spec:
  scenario: The index records paths with a mode and id
  status: failing
  lines:
    - kw: Given
      text: 'a new empty index'
    - kw: When
      text: 'Set(hello.txt, 100644, ce013625030ba8dba906f756967f9e9ca394464a) and Set(README.md, 100644, 0805455a24b6c68fbc38d0fa5d121f735984285d) are called'
    - kw: When
      text: 'the index is queried'
    - kw: Then
      text: 'Get(hello.txt) returns mode 100644 and that id, and Paths() returns README.md then hello.txt in sorted order'
code:
  lang: go
  source: |
    type IndexEntry struct{ Mode, Id string }
    type Index struct{ entries map[string]IndexEntry }
    func (ix *Index) Set(path, mode, id string) { ix.entries[path] = IndexEntry{mode, id} }
    func (ix *Index) Paths() []string { /* keys, then sort.Strings */ }
checkpoint: 'You have an in-memory staging index. Commit and stop here.'
---

A commit is a snapshot, but you rarely want to snapshot your whole working
directory exactly as it is. The **index** (also called the staging area) is the
list you build up deliberately: "include this file, at this version." Each entry
maps a **path** to the **mode** and the **blob id** that should go into the next
commit. It is the middle layer between your editable files and the immutable
objects in the store.

Today the index is just an in-memory map with a way to read entries back and list
paths in sorted order. Sorting matters because `write-tree` will later turn these
paths into tree objects, and trees are sorted. Keep it simple now: set an entry,
get it back, list the paths. The next lessons fill the index from real files and
persist it to disk.
