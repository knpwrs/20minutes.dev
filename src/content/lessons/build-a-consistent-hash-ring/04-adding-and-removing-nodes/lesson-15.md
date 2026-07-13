---
project: build-a-consistent-hash-ring
lesson: 15
title: Ring versus modulo, side by side
overview: Time to put the two schemes on the same scale. Grow from three nodes to four and count the keys that move under each. The ring moves one key where modulo moves eight - the whole point of the project in a single comparison.
goal: Compare keys moved when a node joins and then leaves - ring versus modulo hashing.
spec:
  scenario: Adding a node moves far fewer keys on the ring
  status: failing
  lines:
    - kw: Given
      text: 'the 12 fruit keys, a ring going from {alpha, beta, gamma} to {alpha, beta, gamma, delta}, and modulo hashing going from n=3 to n=4'
    - kw: When
      text: 'the keys moved are counted for each scheme over the same node-count change, both adding delta (3 to 4 nodes) and then removing it again (4 to 3 nodes)'
    - kw: Then
      text: 'adding the node moves 1 key (orange) on the ring while modulo (n=3 to n=4) moves 8 keys - a fraction of 1/12 versus 8/12'
    - kw: And
      text: 'removing the node is just as cheap on the ring (1 key moves back) yet modulo (n=4 to n=3) still moves 8 keys, and every scheme always assigns all 12 keys'
code:
  lang: go
  source: |
    // Ring add:    MovedKeys(before, after) from lesson 13 -> 1.
    // Modulo add:  MovedCount(keys, 3, 4) from lesson 4 -> 8.
    // Ring remove: MovedKeys the other direction        -> 1.
    // Modulo remove: MovedCount(keys, 4, 3)             -> 8.
    // Same events, two very different costs, in both directions.
checkpoint: You have proven the ring beats modulo by 1 moved key versus 8. Commit and stop here.
---

This is the headline result, measured. The same event - a fourth node joins a cluster of
three - costs the ring **1** reassigned key and costs modulo hashing **8**. Remove that
node again and the story is symmetric: the ring moves the single key back while modulo
reshuffles **8** once more. Both schemes still place all twelve keys and both spread them
across the nodes; the difference is entirely in the churn. On the ring, only `orange`
moves, because only `orange` sits in the new node's arc. Under modulo, changing the
divisor reshuffles two thirds of everything, in either direction.

Scale that up and the gap is the whole reason consistent hashing exists. With `K` keys
and `N` nodes, adding or removing a node moves about `K/N` keys on the ring - the keys in
one node's arc - while modulo moves on the order of `K` keys, nearly all of them. For a
cache in front of a database, that is the difference between a brief flurry of misses and
a full cache flush that hammers the database every time the cluster resizes. You have now
built and proven the core of a consistent hash ring.
