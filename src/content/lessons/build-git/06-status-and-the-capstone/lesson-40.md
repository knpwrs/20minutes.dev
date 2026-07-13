---
project: build-git
lesson: 40
title: 'Capstone: the second commit'
overview: 'A version control system is about change over time. Today you make the second commit, editing a file and re-staging, and watch the tree, the commit, and the branch all advance with exact ids.'
goal: 'Make a second commit that changes a file and assert the advanced tree, commit, and branch.'
spec:
  scenario: A second commit records a change
  status: failing
  lines:
    - kw: Given
      text: 'the repository after the first commit, with hello.txt changed to hello world and a newline'
    - kw: When
      text: 'hello.txt is re-staged and committed at 1700000060 +0000 with message Update greeting'
    - kw: Then
      text: 'the new blob for hello.txt is 3b18e512dba79e4c8300dd08aeb37f8e728b8dad and the new root tree is 4ab82d44e36709a311a91646e9fb09c1f35af3d4'
    - kw: And
      text: 'the commit id is 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6 with parent f18e98d326b190d096879422d56d4ac5cf572db1, refs/heads/main now points at it, and Log() returns 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6 then f18e98d326b190d096879422d56d4ac5cf572db1'
code:
  lang: go
  source: |
    // edit hello.txt on disk to "hello world\n", then:
    r.Add(ix, "hello.txt")            // 3b18e512...
    id, _ := r.Commit(ix, ident2, "Update greeting\n")
    // id == "9bae7f0a..."; parent == first commit; Log() == [id, first]
checkpoint: 'Your history has two linked commits with exact ids. Commit and stop here.'
---

Change is the whole point of version control, and here it flows through every
layer cleanly. Editing `hello.txt` and re-staging produces a new blob `3b18e512...`;
`write-tree` rebuilds only what changed, giving a new root tree `4ab82d44...` while
the unchanged `README.md` blob and `src` subtree are reused by id; and `commit`
picks up the first commit as parent, yielding `9bae7f0a...` and advancing `main`.

That reuse is the Merkle DAG earning its keep: identical content is never stored
twice, and unchanged subtrees are shared across commits for free. `Log()` now walks
the two-commit chain newest first. The repository holds a real, linked history that
real Git can read. The last lesson runs the entire session start to finish and
proves exactly that.
