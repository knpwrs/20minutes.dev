---
project: build-git
lesson: 41
title: 'Capstone: a full session real Git can read'
overview: 'The finale runs an entire mini-git session end to end and asserts every exact id at once, then confirms the objects it wrote are readable by real Git. Every layer you built proves itself together.'
goal: 'Run a complete init-add-commit-edit-commit session and assert every id, the branch, the log, and a clean status.'
spec:
  scenario: A full session ends in a verifiable two-commit repository
  status: failing
  lines:
    - kw: Given
      text: 'a fresh repository and the script: init; write hello.txt, README.md, src/main.go; add all; commit as Ada at 1700000000 (Initial commit); change hello.txt to hello world; add; commit at 1700000060 (Update greeting)'
    - kw: When
      text: 'the script runs in order'
    - kw: Then
      text: 'the first commit is f18e98d326b190d096879422d56d4ac5cf572db1 (root tree b7c8f173c30a232f001cc4d77c259e4c99afbbd8) and the second is 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6 (root tree 4ab82d44e36709a311a91646e9fb09c1f35af3d4, parent the first)'
    - kw: And
      text: 'refs/heads/main is 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6, Log() is those two ids newest first, Status() reports all tracked files unchanged, and every object is readable by real git cat-file -p'
code:
  lang: go
  source: |
    // the whole project in one run: init -> add -> commit -> edit -> add -> commit
    // assert: both commit ids, both root trees, main == C2, Log == [C2, C1],
    //         Status all unchanged. Then, outside the test:
    //   git --git-dir=<repo>/.mygit cat-file -p 9bae7f0a...  reads YOUR commit
checkpoint: 'Your mini-git is complete: a real content-addressable version control system whose objects Git itself can read. The project is done. Commit and stop here.'
---

This is the promise the whole project was built to keep: a working **mini-git**.
The script drives every layer at once. `init` creates the object database;
`add` stores blobs and stages them; `commit` writes nested trees and a commit and
advances `main`; a second edit-add-commit grows a linked history; `Log` walks the
chain; `Status` confirms the working tree matches what was committed. Every id, from
the blobs through the trees to both commits, is asserted exact, and they are the
same ids real Git computes.

The final proof is the one that makes it undeniable: the objects your library wrote
are byte-compatible with Git, so pointing real `git cat-file -p` at your `.mygit`
object store prints your commits, trees, and blobs perfectly. From an empty
directory you have built the honest heart of Git, a content-addressable object
database, the Merkle DAG of trees and commits, an index, refs, and a symbolic HEAD.
That is a real version control system, and it is yours.
