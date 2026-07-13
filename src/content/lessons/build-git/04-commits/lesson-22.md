---
project: build-git
lesson: 22
title: 'The commit object'
overview: 'A commit ties a tree to an author, a committer, and a message. Assemble those lines in the right order, hash them, and you get a commit id that matches real Git exactly. Today you build your first commit object.'
goal: 'Build a commit object for a root tree with no parent and hash it to its exact id.'
spec:
  scenario: A parentless commit hashes to its exact id
  status: failing
  lines:
    - kw: Given
      text: 'the root tree b7c8f173c30a232f001cc4d77c259e4c99afbbd8, author and committer Ada Lovelace <ada@example.com> 1700000000 +0000, and the message Initial commit with a trailing newline'
    - kw: When
      text: 'BuildCommit assembles the body as tree line, author line, committer line, a blank line, then the message, and hashes it as a commit'
    - kw: Then
      text: 'the body begins with tree b7c8f173c30a232f001cc4d77c259e4c99afbbd8 and a newline, has no parent line, and the author and committer lines follow'
    - kw: And
      text: 'the commit id is f18e98d326b190d096879422d56d4ac5cf572db1'
code:
  lang: go
  source: |
    // "tree <id>\n" + "author <ident>\n" + "committer <ident>\n" + "\n" + message
    body := "tree " + tree + "\n"
    body += "author " + ident + "\n"
    body += "committer " + ident + "\n"
    body += "\n" + message // message already ends in "\n"
    id, _ := r.WriteObject("commit", []byte(body))
checkpoint: 'Your commit id matches real Git. Commit and stop here. Confirm with git commit-tree.'
---

A commit object is just structured text. The lines come in a fixed order: `tree`
and its id, then (later) any `parent` lines, then the `author` line, the
`committer` line, a single **blank line**, and finally the commit message. That is
the entire format. Wrap it as a `commit` object and hash it, exactly as with blobs
and trees.

Because every part feeds the hash, the tree id, both identity lines, and the
message all determine the commit id. With our fixed identity and timestamp, this
initial commit over the root tree is always `f18e98d3...`. You can reproduce it in
real Git with `git commit-tree` and the same dates, and get the same id back. A
commit is thus a content-addressed snapshot-plus-metadata: it names a whole tree
(the entire project state) with one id.
