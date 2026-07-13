---
project: build-a-physics-engine
lesson: 41
title: Broadphase pairing
overview: Testing every body against every other is wasteful, so first you cheaply reject pairs that cannot touch using their bounding boxes. Today you build the broadphase.
goal: Return the candidate pairs of bodies whose world bounding boxes overlap.
spec:
  scenario: Culling pairs by bounding box
  status: failing
  lines:
    - kw: Given
      text: 'three bodies with radius-1 circles at {0, 0}, {1.5, 0}, and {10, 0}'
    - kw: When
      text: the broadphase computes candidate pairs
    - kw: Then
      text: 'only the pair of the first two bodies is returned (their bounding boxes overlap)'
    - kw: And
      text: the far-away third body forms no pair with either
code:
  lang: go
  source: |
    func aabbOverlap(a, b AABB) bool {
      return a.Min.X <= b.Max.X && a.Max.X >= b.Min.X &&
        a.Min.Y <= b.Max.Y && a.Max.Y >= b.Min.Y
    }
    func Broadphase(bodies []*Body) [][2]int {
      var pairs [][2]int
      // for each i < j, if their WorldBounds overlap, add {i, j}
      return pairs
    }
checkpoint: The broadphase returns only the body pairs worth testing precisely. Commit and stop here.
---

Exact collision tests are relatively expensive, and a scene of `n` bodies has `n^2`
possible pairs, so running the precise test on all of them is wasteful - most bodies
are nowhere near each other. The **broadphase** is a cheap first pass that rejects pairs
that provably cannot touch by comparing their **bounding boxes**, which you already have
every shape report. Two boxes that do not overlap mean two shapes that cannot overlap,
so that pair is skipped before the costly narrowphase ever runs.

This brute-force version still checks every pair of boxes, which is `n^2` box tests -
fine for the small scenes here, and cheap because a box overlap is four comparisons. The
bodies at `{0, 0}` and `{1.5, 0}` have overlapping boxes and become a candidate; the one
at `{10, 0}` is far from both and pairs with neither. Real engines replace this loop with
a grid or a sorted sweep to get below `n^2`, which is the natural optimization to try
after the project. The narrowphase runs only on what survives here.
