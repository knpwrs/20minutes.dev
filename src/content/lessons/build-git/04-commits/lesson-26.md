---
project: build-git
lesson: 26
title: 'The commit porcelain'
overview: 'The friendly commit command glues the pieces together: turn the index into a tree, then commit that tree. Today you build that glue and produce a real commit straight from the staging area.'
goal: 'Commit the current index in one step by combining write-tree and commit-tree.'
spec:
  scenario: Committing the index produces a commit
  status: failing
  lines:
    - kw: Given
      text: 'an index staged with hello.txt, README.md, and src/main.go, the fixed identity and time, and the message Initial commit'
    - kw: When
      text: 'Commit(index, no parents, message) runs write-tree then commit-tree on the result'
    - kw: Then
      text: 'the tree it writes is b7c8f173c30a232f001cc4d77c259e4c99afbbd8'
    - kw: And
      text: 'the commit id it returns is f18e98d326b190d096879422d56d4ac5cf572db1'
code:
  lang: go
  source: |
    // write-tree the index, then commit-tree the resulting root tree
    func (r *Repo) Commit(ix *Index, parents []string, ident, msg string) (string, error) {
      tree, err := r.WriteTreeFromIndex(ix)
      if err != nil { return "", err }
      return r.CommitTree(tree, parents, ident, msg)
    }
checkpoint: 'You can commit the staging area in one step. Commit and stop here. cat-file -p the commit and the tree it points at.'
---

This is the command a user actually runs: `commit`. Everything under it already
exists, so the porcelain is pure glue. It calls `write-tree` to snapshot the
index into a root tree, then `commit-tree` to wrap that tree in a commit with the
given parents and message. The result is a commit id that captures the exact
staged state.

Notice how the layers stack: blobs hold file contents, trees hold directory
structure, a commit names one root tree plus metadata, and this porcelain drives
all three from the staging area. Staging the three files and committing with no
parent yields the same `f18e98d3...` we built by hand, now produced end to end
from real files. What is still missing is memory: this commit is not yet recorded
anywhere a branch can find it. Refs, next chapter, fix that.
