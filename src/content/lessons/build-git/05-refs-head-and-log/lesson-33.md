---
project: build-git
lesson: 33
title: 'Creating a branch'
overview: 'A new branch is just a new ref pointing at a commit. Today you create one, and confirm it starts life pointing at the same commit as the branch you are on, without moving HEAD.'
goal: 'Create a branch ref at the current commit, leaving HEAD unchanged.'
spec:
  scenario: A new branch points at the current commit
  status: failing
  lines:
    - kw: Given
      text: 'the repository on main at 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6, with HEAD as ref: refs/heads/main'
    - kw: When
      text: 'Branch(dev) is called'
    - kw: Then
      text: 'refs/heads/dev is created holding 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6, the same id as refs/heads/main'
    - kw: And
      text: 'HEAD is unchanged, still ref: refs/heads/main, so creating a branch does not switch to it'
code:
  lang: go
  source: |
    // point a new branch ref at wherever HEAD currently resolves
    func (r *Repo) Branch(name string) error {
      id, _ := r.Resolve("HEAD")
      return r.UpdateRef("refs/heads/"+name, id)
    }
checkpoint: 'You can create branches. Commit and stop here.'
---

Creating a branch is one of Git's cheapest operations because a branch is one
small file. `Branch("dev")` resolves the current commit and writes it to
`refs/heads/dev`. Now two branch labels, `main` and `dev`, point at the very same
commit `9bae7f0a...`. No objects are copied; both are just names for the same tip.

Crucially, creating a branch does **not** move HEAD onto it: you stay on `main`.
This separation matters, because the branch you are *on* (HEAD) and the branches
that merely *exist* are different things. To start adding commits to `dev` you must
first switch to it, which retargets HEAD, and that is the last piece of this
chapter.
