---
project: build-git
lesson: 25
title: 'Reading a commit'
overview: 'To walk history we need to read a commit back into its parts: the tree it points at, its parents, and its message. Today you parse a commit object, the inverse of building one.'
goal: 'Parse a commit object into its tree, parents, and message.'
spec:
  scenario: A commit object parses into its fields
  status: failing
  lines:
    - kw: Given
      text: 'the stored commits f18e98d326b190d096879422d56d4ac5cf572db1 and 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6'
    - kw: When
      text: 'ReadCommit(id) parses each'
    - kw: Then
      text: 'the first has tree b7c8f173c30a232f001cc4d77c259e4c99afbbd8, no parents, and message Initial commit'
    - kw: And
      text: 'the second has tree 4ab82d44e36709a311a91646e9fb09c1f35af3d4, one parent f18e98d326b190d096879422d56d4ac5cf572db1, and message Update greeting'
code:
  lang: go
  source: |
    // header lines until the blank line: "tree X", "parent Y", "author ...";
    // everything after the blank line is the message
    func (r *Repo) ReadCommit(id string) (*Commit, error) {
      _, _, body, _ := r.CatFile(id)
      // split on the first blank line; parse "key value" header lines
    }
checkpoint: 'You can read a commit''s tree, parents, and message. Commit and stop here.'
---

Parsing a commit mirrors parsing a tree, but it is line-oriented text. Split the
body at the **first blank line**: everything before it is headers, everything
after is the message. Each header line is a keyword and a value: `tree` with one
id, zero or more `parent` lines each with an id, and the `author` and `committer`
lines. Collect the parents into a list in the order they appear.

This gives us everything we need to traverse the commit graph. A commit knows its
**tree** (so we can inspect the snapshot) and its **parents** (so we can walk
backward through history). With reading in hand, `log` becomes a simple loop:
start at a commit, print it, follow the first parent, repeat. We build that once
we have refs to tell us where to start.
