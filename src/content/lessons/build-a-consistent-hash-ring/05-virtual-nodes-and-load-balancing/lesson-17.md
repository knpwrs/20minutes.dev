---
project: build-a-consistent-hash-ring
lesson: 17
title: More virtual nodes smooth the load
overview: Virtual nodes earn their keep when there are many of them. Today you watch a lopsided distribution flatten out as you raise the replica count from 1 to 200 across a large keyset - the reason every real ring uses vnodes.
goal: Show that more virtual nodes per node give a more even key distribution.
spec:
  scenario: Raising the replica count evens out the load
  status: failing
  lines:
    - kw: Given
      text: 'the 2000 keys key0 through key1999 and a ring of alpha, beta, gamma'
    - kw: When
      text: 'Distribution is measured with each node added at v=1 and again at v=200'
    - kw: Then
      text: 'at v=1 the load is lopsided: alpha 760, beta 903, gamma 337 (a spread of 566)'
    - kw: And
      text: 'at v=200 it is far more even: alpha 630, beta 706, gamma 664 (a spread of 76)'
code:
  lang: go
  source: |
    // Build two rings over the same nodes, one with v=1 and one with
    // v=200 replicas each, and run Distribution over key0..key1999.
    // The gap between the busiest and idlest node shrinks sharply.
    for i := 0; i < 2000; i++ { keys = append(keys, fmt.Sprintf("key%d", i)) }
checkpoint: More virtual nodes give a much more even load. Commit and stop here.
---

With one position each, three nodes carve the ring into three arcs whose sizes are pure
luck of the hash - here `beta` gets 903 keys while `gamma` gets 337, more than double.
Give each node **200** positions and the ring is now sliced into 600 small arcs; a node's
share is the sum of 200 little arcs, and those sums are close to equal because the
extremes average out. The busy-to-idle spread collapses from 566 keys to 76.

This is the law of large numbers doing load balancing. The more virtual positions a node
has, the closer its total arc length gets to its fair share of the ring, so real systems
use anywhere from dozens to hundreds of vnodes per node. The count is a tradeoff: more
vnodes mean smoother load but a bigger sorted array to search and store. Note the numbers
will not be perfectly equal even at `v=200` - vnodes reduce variance, they do not
eliminate it - but the trend is unmistakable, and it is why nobody runs a serious ring
with one position per node.
