---
project: build-a-consistent-hash-ring
lesson: 3
title: Modulo hashing
overview: The obvious way to spread keys across N nodes is hash(key) modulo N. Today you build it - it works, it is fast, and the next lesson shows why it is a trap. Understanding the naive approach is what makes consistent hashing feel necessary rather than clever.
goal: Assign a key to one of N numbered nodes with hash(key) modulo N.
spec:
  scenario: A key maps to a node index by modulo
  status: failing
  lines:
    - kw: Given
      text: 'N numbered nodes 0..N-1 and ModuloNode(key, n) defined as Hash(key) modulo n'
    - kw: When
      text: 'ModuloNode("apple", 3) is computed'
    - kw: Then
      text: 'it returns 2'
    - kw: And
      text: 'ModuloNode("apple", 4) returns 3 and ModuloNode("lemon", 3) returns 0'
code:
  lang: go
  source: |
    // The textbook way to shard: reduce the hash into the node count.
    func ModuloNode(key string, n int) int {
      return int(Hash(key) % uint32(n))
    }
checkpoint: You can assign any key to one of N nodes by modulo. Commit and stop here.
---

If you have `N` nodes and want to spread keys evenly across them, the first idea anyone
has is **modulo hashing**: number the nodes `0` to `N-1`, hash the key, and take the
remainder modulo `N`. The hash spreads keys roughly uniformly, so each node gets about
`1/N` of them. It is one line, it needs no data structure, and for a fixed set of nodes
it is genuinely fine.

Notice we take the full 32-bit hash modulo `N` here, not the ring position - modulo
hashing does not use a ring at all, it is the baseline we are about to beat. The whole
scheme hinges on `N` being part of the formula. That is the seed of the problem: the
node a key lands on is a function of how many nodes there are, so the day `N` changes,
the answer changes for almost every key. The next lesson measures exactly how badly.
