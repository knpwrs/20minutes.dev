---
project: build-a-consistent-hash-ring
lesson: 23
title: 'Capstone: churn without chaos'
overview: The finale runs a full round of cluster churn against a virtual-node ring - assign the keys, add a node, remove another - and asserts that only a handful of keys move each time, plus the replica set for a chosen key. Every piece you built proves itself at once.
goal: Run a churn workload on a vnode ring and assert exactly which keys move and a replica set.
spec:
  scenario: A full churn cycle moves only a bounded set of keys
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha, beta, gamma each at v=2 and the 12 fruit keys assigned'
    - kw: When
      text: 'delta is added at v=2, then beta is removed, with the assignment captured before and after each step'
    - kw: Then
      text: 'adding delta moves exactly [orange] (1 key), and then removing beta moves exactly [apple, date, elderberry, lemon] (4 keys) - never a full reshuffle'
    - kw: And
      text: 'on the final ring {alpha, gamma, delta} at v=2, Replicas("apple", 3) returns [alpha, delta, gamma]'
code:
  lang: go
  source: |
    r := NewRing()
    for _, n := range []string{"alpha", "beta", "gamma"} { r.AddWeighted(n, 2) }
    before := assign(r, fruits)          // map key -> Get owner
    r.AddWeighted("delta", 2)
    // MovedKeys(before, assign(r, fruits)) == ["orange"]
    r.Remove("beta")
    // MovedKeys(...) == ["apple","date","elderberry","lemon"]
    // r.Replicas("apple", 3) == ["alpha","delta","gamma"]
checkpoint: Your ring survives a full churn cycle with minimal, exact remapping. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a **consistent hash ring** that
takes cluster churn in stride. The workload runs on a virtual-node ring, exactly the kind
you would deploy. Adding `delta` pulls just `orange` onto the new node - one key of twelve,
even with vnodes multiplying the positions - and removing `beta` hands its four keys
(`apple`, `date`, `elderberry`, `lemon`) to their successors and disturbs nothing else.
Where lesson four's modulo scheme reshuffled two thirds of the keys on a single node
change, the ring moves a bounded handful, every time, and you can predict exactly which.

Then `Replicas("apple", 3)` closes the loop, returning `[alpha, delta, gamma]` - three
distinct machines walked clockwise, skipping repeat virtual positions, ready to survive
two failures. From a one-line hash you have built the honest core of the scheme behind
Dynamo, Cassandra, and every consistent-hashing cache: nodes and keys on a shared circle,
ownership by the nearest node clockwise, minimal remapping under churn, virtual nodes for
balance and weighting, and replica sets for durability. Swap the tiny teaching hash for
SHA-1 and the same ring runs a real cluster. That is a consistent hash ring, and it is
yours.
