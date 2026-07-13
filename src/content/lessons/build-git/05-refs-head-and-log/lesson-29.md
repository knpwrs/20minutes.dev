---
project: build-git
lesson: 29
title: 'Resolving HEAD to a commit'
overview: 'Reading HEAD all the way to a commit means following the symbolic ref to a branch and the branch to an id, while handling the branch that does not exist yet. Today you build that resolution.'
goal: 'Resolve HEAD to the commit id it ultimately points at, or nothing if the branch is unborn.'
spec:
  scenario: HEAD resolves through its branch to a commit
  status: failing
  lines:
    - kw: Given
      text: 'HEAD holding ref: refs/heads/main and the ref refs/heads/main holding f18e98d326b190d096879422d56d4ac5cf572db1'
    - kw: When
      text: 'Resolve(HEAD) follows the symbolic ref to the branch and reads its id'
    - kw: Then
      text: 'it returns f18e98d326b190d096879422d56d4ac5cf572db1'
    - kw: And
      text: 'if refs/heads/main does not exist yet (an unborn branch) it returns the empty string, and if HEAD instead holds a raw 40-hex id (a detached HEAD) that id is returned directly'
code:
  lang: go
  source: |
    // symbolic HEAD -> read the branch ref; missing branch -> "" (unborn)
    func (r *Repo) Resolve(name string) (string, error) {
      if name == "HEAD" { /* read HEAD */ }
      // if it starts with "ref: ", recurse on the target ref name
      // if the ref file is missing, return "" (unborn); else return its id
    }
checkpoint: 'HEAD resolves to a commit id. Commit and stop here.'
---

Resolving a ref means chasing the pointers until you reach an id. HEAD usually
holds `ref: refs/heads/main`, so you follow that to the branch file and read the
commit id there. Two edges make this real. First, a brand-new repository has HEAD
pointing at `main` but **no branch file yet**, an *unborn* branch; resolving it
yields nothing rather than an error, which is exactly the state before the first
commit. Second, HEAD can hold a **raw commit id** instead of a `ref: ` line, a
*detached HEAD*, and then it resolves to that id directly.

These two cases are the boundaries of ref resolution, and pinning them keeps the
logic honest: the happy path (HEAD to branch to id) is easy, but the unborn and
detached cases are where naive code returns garbage or crashes. With `Resolve` in
hand, the commit porcelain can find its own starting point, which is what the next
lesson needs.
