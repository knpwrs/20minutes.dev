---
project: build-git
lesson: 30
title: 'Committing moves the branch'
overview: 'A commit should remember itself. Today the commit porcelain hooks into HEAD: it takes its parent from the current branch and, after writing the commit, advances that branch to point at it.'
goal: 'Make commit find its parent from HEAD and move the current branch forward.'
spec:
  scenario: The first commit creates and advances the branch
  status: failing
  lines:
    - kw: Given
      text: 'a fresh repository with HEAD set to ref: refs/heads/main (an unborn branch), an index staged with hello.txt, README.md, and src/main.go, and the message Initial commit'
    - kw: When
      text: 'Commit(index, message) resolves HEAD for a parent (none, since unborn), writes the commit, and updates refs/heads/main to it'
    - kw: Then
      text: 'the commit id is f18e98d326b190d096879422d56d4ac5cf572db1 with no parent'
    - kw: And
      text: 'refs/heads/main now holds that id, so Resolve(HEAD) returns f18e98d326b190d096879422d56d4ac5cf572db1'
code:
  lang: go
  source: |
    // parent = Resolve("HEAD") (empty when unborn); branch = HEAD's target name
    func (r *Repo) Commit(ix *Index, ident, msg string) (string, error) {
      parent, _ := r.Resolve("HEAD")
      var parents []string
      if parent != "" { parents = []string{parent} }
      id, _ := r.CommitTree(tree, parents, ident, msg)
      r.UpdateRef(headTargetName, id) // move the current branch
      return id, nil
    }
checkpoint: 'Committing records itself on the current branch. Commit and stop here.'
---

Until now a commit vanished the moment you made it: nothing pointed at it. This
lesson wires the porcelain into refs so history accumulates. Two halves, both
reading HEAD. First, the commit's **parent** is whatever the current branch points
at right now, found via `Resolve("HEAD")`; for an unborn branch that is empty, so
the first commit has no parent. Second, after writing the commit, we **advance the
branch** HEAD names to the new id, creating `refs/heads/main` if it did not exist.

The commit command no longer needs you to pass parents by hand; it finds them from
HEAD. That is the everyday `git commit` behavior in miniature: commit, and your
current branch moves to include it. The first commit produces the same
`f18e98d3...` and leaves `main` pointing at it. With the branch remembering the
tip, the next commit can build on it automatically.
