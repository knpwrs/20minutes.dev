---
project: build-git
lesson: 10
title: 'Reading a tree'
overview: 'To walk history later we need to read a tree back, not just write one. Today you parse a tree object''s binary body into a list of entries, the inverse of the last lesson.'
goal: 'Parse a tree object back into its list of entries.'
spec:
  scenario: A tree object parses back into entries
  status: failing
  lines:
    - kw: Given
      text: 'the stored tree 3aa9b583db8437a8dabb60b4b4c86ae87c17de85'
    - kw: When
      text: 'ReadTree(id) parses its body'
    - kw: Then
      text: 'it returns two entries: mode 100644 name README.md id 0805455a24b6c68fbc38d0fa5d121f735984285d, then mode 100644 name hello.txt id ce013625030ba8dba906f756967f9e9ca394464a'
    - kw: And
      text: 'each id is rendered back to 40 hex characters from the 20 raw bytes in the body'
code:
  lang: go
  source: |
    // repeatedly: read up to a space (mode), up to a NUL (name),
    // then exactly 20 bytes (id), until the body is consumed
    func (r *Repo) ReadTree(id string) ([]Entry, error) {
      _, _, body, err := r.CatFile(id)
      // loop: space splits mode|name-start, NUL ends name, next 20 bytes are id
    }
checkpoint: 'You can read a tree''s entries back. Commit and stop here.'
---

Parsing a tree is a small state machine over the body. From the current position,
read ASCII up to the next **space** to get the mode, then up to the next **NUL**
to get the name, then take exactly the next **20 bytes** as the raw id and render
them back to 40 hex characters. Repeat until the body is exhausted. There are no
separators between entries beyond this structure; the fixed 20-byte id length is
what lets you find where one entry ends and the next mode begins.

Reading trees is what makes a repository navigable: given a commit's root tree you
can list a directory, follow a subdirectory entry to its subtree, and eventually
reach a blob. We will use this to implement `log` and `status` later. For now,
prove the round-trip: the tree you wrote last lesson reads back to the same two
entries.
