---
project: build-git
lesson: 23
title: 'commit-tree: storing the commit'
overview: 'Building the commit body and storing it deserve to be one command. Today you wrap it as commit-tree, which stores a commit for a given tree and returns its id, and confirm the stored object reads back as a commit.'
goal: 'Store a commit object with commit-tree and read it back.'
spec:
  scenario: commit-tree stores a readable commit
  status: failing
  lines:
    - kw: Given
      text: 'the root tree b7c8f173c30a232f001cc4d77c259e4c99afbbd8, the fixed identity and time, and the message Initial commit'
    - kw: When
      text: 'CommitTree(tree, no parents, ident, message) stores the commit'
    - kw: Then
      text: 'it returns f18e98d326b190d096879422d56d4ac5cf572db1'
    - kw: And
      text: 'CatFile of that id reports type commit, and the object round-trips through the store'
code:
  lang: go
  source: |
    // build the body (last lesson) and store it; return the id
    func (r *Repo) CommitTree(tree string, parents []string, ident, msg string) (string, error) {
      body := buildCommitBody(tree, parents, ident, msg)
      return r.WriteObject("commit", body)
    }
checkpoint: 'commit-tree stores commits you can read back. Commit and stop here.'
---

`commit-tree` is the plumbing command that takes a tree id (and later, parent ids)
and writes a commit object, returning its id. It is a thin wrapper over the body
assembly from the last lesson plus `WriteObject`, but making it a named operation
gives the rest of the project a clean handle: "commit this tree." We give it a
`parents` argument now even though we pass none yet, because the very next lesson
needs it.

The confirmation is that the commit is a first-class object in the store: `cat-file`
reports its type as `commit`, and its bytes read back unchanged. Everything in Git
is one of a handful of object types in one object database, and commits are no
exception. Real `git cat-file -p f18e98d3...` prints the same tree line, identity
lines, and message you stored.
