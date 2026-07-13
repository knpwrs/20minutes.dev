---
project: build-git
lesson: 24
title: 'Parent links'
overview: 'History is a chain: each commit (after the first) records its parent, the commit that came before it. Today you add the parent line, turning isolated commits into a linked graph.'
goal: 'Build a commit with a parent line and hash it to its exact id.'
spec:
  scenario: A commit with a parent hashes to its exact id
  status: failing
  lines:
    - kw: Given
      text: 'the tree 4ab82d44e36709a311a91646e9fb09c1f35af3d4 (hello.txt changed to hello world and a newline), parent f18e98d326b190d096879422d56d4ac5cf572db1, identity Ada Lovelace <ada@example.com> 1700000060 +0000, and message Update greeting'
    - kw: When
      text: 'CommitTree is called with that one parent'
    - kw: Then
      text: 'the body has a parent line reading parent f18e98d326b190d096879422d56d4ac5cf572db1 between the tree line and the author line'
    - kw: And
      text: 'the commit id is 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6'
code:
  lang: go
  source: |
    // parent lines go after tree, before author, one per parent, in order
    body := "tree " + tree + "\n"
    for _, p := range parents {
      body += "parent " + p + "\n"
    }
    body += "author " + ident + "\n" // ...committer, blank, message
checkpoint: 'Commits link to their parents. Commit and stop here.'
---

A **parent** line is what makes history a graph rather than a pile of snapshots.
It goes immediately after the `tree` line and before the `author` line, and it
holds the id of the preceding commit. A commit can have zero parents (the very
first commit), one parent (the normal case), or several (a merge), and each parent
gets its own line in order. Since the parent id is part of the body, it feeds the
hash, which is what chains the whole history together into a tamper-evident
sequence: change any old commit and every descendant's id changes.

Here the second commit changes `hello.txt` to `hello world`, producing a new blob,
a new root tree `4ab82d44...`, and, with the parent pointing back at the first
commit, the id `9bae7f0a...`. That is a two-commit history, cryptographically
linked. We will walk exactly this chain when we build `log`.
