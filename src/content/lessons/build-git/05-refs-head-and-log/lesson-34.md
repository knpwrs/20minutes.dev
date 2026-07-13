---
project: build-git
lesson: 34
title: 'Switching branches'
overview: 'Switching branches is retargeting HEAD to point at a different branch. Today you build checkout, then prove that committing afterwards advances the new branch and leaves the old one alone.'
goal: 'Switch HEAD to another branch so that new commits advance it, not the branch you left.'
spec:
  scenario: Checkout retargets HEAD and diverges history
  status: failing
  lines:
    - kw: Given
      text: 'the repository with main and dev both at 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6 and HEAD as ref: refs/heads/main'
    - kw: When
      text: 'Checkout(dev) rewrites HEAD, then a further file change is staged and committed'
    - kw: Then
      text: 'after Checkout, HEAD reads ref: refs/heads/dev and Resolve(HEAD) is 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6'
    - kw: And
      text: 'after the new commit, refs/heads/dev has moved to it (with parent 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6) while refs/heads/main is unchanged at 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6'
code:
  lang: go
  source: |
    // switching branches is just pointing HEAD at a different ref
    func (r *Repo) Checkout(name string) error {
      return r.SetHEAD("refs/heads/" + name)
    }
    // afterwards, Commit advances refs/heads/dev; main stays put
checkpoint: 'You can switch branches and diverge history. Commit and stop here. The whole refs chapter now behaves like Git''s branching.'
---

Switching branches is almost anticlimactic: `Checkout("dev")` just rewrites HEAD to
`ref: refs/heads/dev`. That is all "being on dev" means. We do not touch the
working files (real Git would update them to match; ours retargets the pointer
only, a limitation we will name in the caveats). The power is in what happens next.

Because commit takes its parent from HEAD and advances the branch HEAD names, a
commit made after checkout extends `dev` and leaves `main` exactly where it was.
The two branches, once identical, now **diverge**: `dev` has a new commit whose
parent is the old shared tip, and `main` still points at that shared tip. That is
the whole basis of branching in Git, built from nothing but small ref files and a
symbolic HEAD. History is no longer a line; it is a graph, and you can grow either
branch independently.
