---
project: build-git
lesson: 19
title: 'The empty tree'
overview: 'An empty index should still produce a valid tree, and it produces one of Git''s most recognisable constants. Today you pin that boundary, the tree with no entries.'
goal: 'Confirm that write-tree of an empty index produces the empty tree id.'
spec:
  scenario: An empty index produces the empty tree
  status: failing
  lines:
    - kw: Given
      text: 'an empty index with no entries'
    - kw: When
      text: 'WriteTreeFromIndex builds a tree'
    - kw: Then
      text: 'the tree body is empty, so the object is a tree of size 0'
    - kw: And
      text: 'its id is 4b825dc642cb6eb9a060e54bf8d69288fbee4904, the well-known empty tree'
code:
  lang: go
  source: |
    // no entries -> empty body -> HashObject("tree", []byte{})
    // this must equal the pinned empty-tree id
    id, _ := r.WriteTreeFromIndex(NewIndex())
    // id == "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
checkpoint: 'The empty tree hashes correctly. Commit and stop here.'
---

A tree with no entries has an empty body, so its serialized form is just the
header `tree 0` and a NUL. Hash that and you get `4b825dc6...`, a constant that
appears throughout Git internals (it is the parent-tree of an initial commit's
diff, among other uses). There is no special case in your code: the same
`write-tree` path that handles files handles zero files, because an empty list
concatenates to empty bytes.

This is a boundary worth pinning precisely because it is easy to get subtly
wrong, for example by writing nothing at all instead of a real (if empty) object,
or by adding a stray byte. If your empty tree matches `4b825dc6...`, your object
serialization is correct right down to the degenerate case. Next lesson,
subdirectories.
