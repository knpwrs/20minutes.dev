---
project: build-git
lesson: 20
title: 'write-tree with subdirectories'
overview: 'The full write-tree groups index paths by their directory, recursively builds a subtree for each, and links them into the root tree. Today you complete it, turning a flat list of paths into a real tree of directories.'
goal: 'Turn an index with subdirectory paths into nested tree objects and a root tree.'
spec:
  scenario: A nested index becomes a tree of trees
  status: failing
  lines:
    - kw: Given
      text: 'an index holding hello.txt, README.md, and src/main.go (main.go at 06ab7d0f9a35a7d1070711496d6ca1cb892a258f)'
    - kw: When
      text: 'WriteTreeFromIndex groups paths by their first path segment, recursively builds a tree for the src group, and links it as a mode-40000 entry named src'
    - kw: Then
      text: 'the src subtree id is b9270df7070cc6a5e7dbdec610a7ce4f54c47b20 and the root tree id is b7c8f173c30a232f001cc4d77c259e4c99afbbd8'
    - kw: And
      text: 'every tree it builds (root and each subtree) is written to the store'
code:
  lang: go
  source: |
    // group entries by first segment: no slash -> a file entry here;
    // "dir/rest" -> collect under "dir", recurse on the rest, add a 40000 entry
    func (r *Repo) buildTree(entries map[string]IndexEntry) (string, error) {
      // files: Entry{mode,name,id}; dirs: recurse -> subId, Entry{"40000",dir,subId}
    }
checkpoint: 'write-tree builds the full nested tree from the index. Commit and stop here. Stage the same files in real Git and git write-tree gives the identical id.'
---

This is the heart of `write-tree`. Group the index entries by their **first path
segment**: a path with no slash (`hello.txt`) is a file entry in the current
tree, while a path like `src/main.go` belongs to the `src` group with the
remaining part (`main.go`) as its path *inside* that group. Recurse on each group
to build its subtree, then add a `40000` entry naming the directory and pointing
at the subtree's id. The recursion bottoms out at directories containing only
files.

Because every subtree is written to the store as it is built, the whole hierarchy
is persisted, and the root tree id is a single fingerprint for the entire staged
snapshot. Stage `hello.txt`, `README.md`, and `src/main.go` in a real Git
repository and run `git write-tree`: it returns the same `b7c8f173...`. Your
staging area now produces byte-identical trees to Git, which is exactly what a
commit needs.
