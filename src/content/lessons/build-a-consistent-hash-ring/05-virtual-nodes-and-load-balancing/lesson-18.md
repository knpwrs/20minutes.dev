---
project: build-a-consistent-hash-ring
lesson: 18
title: Weighting a node
overview: Not every server is equal - some have more memory or faster disks and should hold more keys. Virtual nodes give weighting for free, because a node with more replicas owns proportionally more of the ring. Today you give one node double the vnodes and watch it take double the load.
goal: Give a node more load by assigning it more virtual nodes than its peers.
spec:
  scenario: A node with more vnodes owns proportionally more keys
  status: failing
  lines:
    - kw: Given
      text: 'the 2000 keys key0 through key1999 and a ring where alpha is added with v=600 while beta and gamma each get v=300'
    - kw: When
      text: 'Distribution is measured over all 2000 keys'
    - kw: Then
      text: 'alpha owns about double the others: alpha 981, beta 499, gamma 520'
    - kw: And
      text: 'the counts sum to 2000 and alpha''s share is near 1/2 while beta and gamma each hold near 1/4'
code:
  lang: go
  source: |
    r := NewRing()
    r.AddWeighted("alpha", 600) // twice the replicas...
    r.AddWeighted("beta", 300)
    r.AddWeighted("gamma", 300)
    // ...gives alpha roughly twice the keys (~1000 of 2000).
checkpoint: A node's load scales with its virtual node count. Commit and stop here.
---

Since a node's load is proportional to how much of the ring its virtual positions cover,
**weighting** falls out with no new mechanism: give a node more vnodes and it covers more
ring. Hand `alpha` 600 replicas against 300 each for `beta` and `gamma` - twice the
positions - and `alpha` draws about twice the keys, roughly 1000 of 2000 while the others
split the rest. This is how a ring accommodates a heterogeneous cluster where a beefy
machine should carry more than a small one.

The proportion is approximate for the same reason lesson 17's balance was: vnode counts
in the hundreds get you close to the target ratio, not exactly onto it, and the smaller
the counts the noisier the result. But the control is real and continuous - want a node
at 1.5x load, give it 1.5x the vnodes. With even distribution and weighting both in hand,
the ring can spread load fairly across machines of any size. The last chapter turns to the
other job a ring does in production: keeping more than one copy of each key.
