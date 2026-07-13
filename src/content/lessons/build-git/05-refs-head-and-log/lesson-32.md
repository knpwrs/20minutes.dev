---
project: build-git
lesson: 32
title: 'log: walking the parent chain'
overview: 'log is the payoff of the commit graph: start at HEAD and follow parent links back through history. Today you walk the chain and list commits newest first.'
goal: 'Walk from HEAD through parent links, listing commit ids newest to oldest.'
spec:
  scenario: log lists commits from HEAD to the root
  status: failing
  lines:
    - kw: Given
      text: 'the repository with two commits, HEAD resolving to 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6 whose parent is f18e98d326b190d096879422d56d4ac5cf572db1'
    - kw: When
      text: 'Log() starts at the HEAD commit and follows the first parent until there is none'
    - kw: Then
      text: 'it returns the ids in order 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6 then f18e98d326b190d096879422d56d4ac5cf572db1'
    - kw: And
      text: 'the walk stops at the parentless first commit rather than looping or erroring'
code:
  lang: go
  source: |
    // start at Resolve("HEAD"); ReadCommit; emit; follow parents[0]; repeat
    func (r *Repo) Log() ([]string, error) {
      id, _ := r.Resolve("HEAD")
      for id != "" {
        // append id; c, _ := r.ReadCommit(id)
        // id = first parent, or "" if none
      }
    }
checkpoint: 'You can walk history with log. Commit and stop here. Your order matches git log --format=%H.'
---

`log` is where the graph you have been building becomes visible. Resolve HEAD to a
commit, then walk: read the commit, emit its id, follow its **first parent**, and
repeat until you reach a commit with no parent. That yields history newest first,
which is how `git log` presents it. The traversal is pure graph-walking over
objects you can already read.

Following only the first parent keeps this linear, which is all a simple history
needs; a merge commit's other parents would branch the walk, but our chain has
none. The stopping condition is the parentless root commit, and getting that right
means the walk terminates cleanly instead of dereferencing an empty parent. Two
commits in, `Log()` returns `9bae7f0a...` then `f18e98d3...`, the same order and
ids `git log --format=%H` prints.
