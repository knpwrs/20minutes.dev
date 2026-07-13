---
project: build-git
lesson: 39
title: 'Capstone: the first commit end to end'
overview: 'Now every layer runs together. Today you initialise a repository, stage three files including one in a subdirectory, commit, and assert every id, from blobs to the commit, matches real Git exactly.'
goal: 'Drive init, add, and commit end to end and assert every resulting id.'
spec:
  scenario: A real first commit from real files
  status: failing
  lines:
    - kw: Given
      text: 'a fresh repository, HEAD as ref: refs/heads/main, and files hello.txt (hello), README.md (# Demo), and src/main.go (package main), each with a trailing newline'
    - kw: When
      text: 'all three are staged and committed as Ada Lovelace <ada@example.com> at 1700000000 +0000 with message Initial commit'
    - kw: Then
      text: 'the blob ids are ce013625030ba8dba906f756967f9e9ca394464a, 0805455a24b6c68fbc38d0fa5d121f735984285d, and 06ab7d0f9a35a7d1070711496d6ca1cb892a258f, and the root tree is b7c8f173c30a232f001cc4d77c259e4c99afbbd8'
    - kw: And
      text: 'the commit id is f18e98d326b190d096879422d56d4ac5cf572db1, refs/heads/main points at it, and Resolve(HEAD) returns it'
code:
  lang: go
  source: |
    r.Init(); r.SetHEAD("refs/heads/main")
    r.Add(ix, "hello.txt"); r.Add(ix, "README.md"); r.Add(ix, "src/main.go")
    id, _ := r.Commit(ix, ident, "Initial commit\n")
    // id == "f18e98d326b190d096879422d56d4ac5cf572db1"
    // ReadRef("refs/heads/main") == id; Resolve("HEAD") == id
checkpoint: 'Your mini-git makes a real first commit. Commit and stop here.'
---

This is the whole stack working as one. `init` lays down the object database and
HEAD; `add` hashes each file into a blob and records it in the index (including
`src/main.go`, which forces a subtree); `commit` runs `write-tree` to snapshot the
index into the nested root tree, then `commit-tree` to wrap it, then advances
`main`. Every id along the way, the three blobs, the `src` subtree, the root tree,
and the commit, is exactly what real Git produces from the same inputs.

Seeing `f18e98d3...` fall out of real file operations, with `main` pointing at it,
is the moment the pieces stop being separate lessons and become a version control
system. One more commit will grow the history, and then the finale ties it all off
with a full session you can cross-check against `git` itself.
