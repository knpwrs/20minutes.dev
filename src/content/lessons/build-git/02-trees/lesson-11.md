---
project: build-git
lesson: 11
title: 'Subdirectories are entries pointing at trees'
overview: 'A directory inside a directory is just an entry whose mode is 40000 and whose id is another tree. Today you nest trees, turning the flat directory listing into a real tree of directories.'
goal: 'Build a tree that contains a subdirectory entry pointing at another tree.'
spec:
  scenario: A tree references a subtree by id
  status: failing
  lines:
    - kw: Given
      text: 'a subtree for src holding main.go at 06ab7d0f9a35a7d1070711496d6ca1cb892a258f (mode 100644)'
    - kw: When
      text: 'that subtree is written, then a root tree is built with entries hello.txt, README.md, and a src entry of mode 40000 pointing at the subtree id'
    - kw: Then
      text: 'the src subtree id is b9270df7070cc6a5e7dbdec610a7ce4f54c47b20'
    - kw: And
      text: 'the root tree id is b7c8f173c30a232f001cc4d77c259e4c99afbbd8'
code:
  lang: go
  source: |
    // a directory entry: mode "40000", name = dir name, id = subtree id
    sub, _ := r.WriteTree([]Entry{{Mode: "100644", Name: "main.go", Id: mainId}})
    root, _ := r.WriteTree([]Entry{
      {Mode: "100644", Name: "hello.txt", Id: helloId},
      {Mode: "100644", Name: "README.md", Id: readmeId},
      {Mode: "40000", Name: "src", Id: sub},
    })
checkpoint: 'You can build nested trees. Commit and stop here. These ids match git write-tree.'
---

Nothing new is needed to represent nested directories: a subdirectory is simply a
tree entry whose mode is `40000` and whose id is the id of another tree. That
other tree is written first (it is a normal object in the store), and the parent
just references it by id. This is why Git can share unchanged subdirectories
across commits for free: if `src/` did not change, its subtree id is identical, so
the parent points at the very same object.

So a repository's whole directory structure is a tree of trees rooted at one
top-level tree, with blobs at the leaves. The root tree id `b7c8f173...` is a
single fingerprint for an entire directory hierarchy: change `main.go` and the
`src` subtree id changes, which changes the root tree id. Next lesson we handle a
subtle ordering rule that these mixed file-and-directory listings depend on.
