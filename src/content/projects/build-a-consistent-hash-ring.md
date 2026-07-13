---
title: 'Build a Consistent Hash Ring'
order: 46
lessons: 23
size: 'Small'
tech: ['Consistent hashing', 'Hash rings', 'Virtual nodes']
estMin: 20
desc: 'Build a consistent hash ring from first principles - a library that maps keys to nodes so that adding or removing a node reshuffles only a small fraction of keys instead of almost all of them. Start by showing why naive modulo hashing remaps nearly every key when the node count changes, then place both nodes and keys on a circular hash space, find each key''s owner as the first node clockwise, make lookups fast with a sorted array and binary search, prove that adding or removing a node moves only about 1/N of the keys, spread load with virtual nodes, weight nodes by giving them more virtual positions, and compute a replica set of R distinct nodes for each key - ending in a ring that survives node churn with minimal, exactly-predictable remapping.'
blurb: 'A deliberately tiny deterministic hash (FNV-1a folded onto a 16-bit ring) makes every node and key position a fixed number you can assert against - no random placement, no real hashing library. Every lesson is one concrete spec with exact positions, owners, and move-sets: the first node clockwise with wraparound past the top, a key landing exactly on a node, adding a node that steals only its arc, removing a node that hands its keys to the successor, virtual nodes smoothing a lopsided load, and a replica set that walks clockwise skipping repeat virtual nodes of a node already chosen.'
overview: |
  Over 23 lessons you build a consistent hash ring - a library that maps keys (cache entries, user records, shards) to a changing set of nodes so that when a node joins or leaves, only a small, predictable slice of keys has to move. That property is what lets distributed caches and databases add and remove servers without repartitioning everything, and you build the whole thing as an importable library whose public API - place a node, look up a key's owner, add or remove nodes, list a key's replicas - is exactly what you would reach for in a real system.

  You start by pinning down a deterministic hash and showing the problem it has to beat: naive modulo hashing (hash(key) % N) remaps almost every key the moment N changes. Then you place nodes and keys on a circular hash space, make a key's owner the first node clockwise, keep node positions in a sorted array and binary-search for the successor with wraparound, and prove the payoff - adding or removing a node moves only about 1/N of the keys while every other key stays put. On top of that core you add virtual nodes to smooth a lopsided load, weight nodes by giving them more virtual positions, and compute a replica set of the next R distinct physical nodes clockwise. The capstone builds a ring with virtual nodes, assigns a set of keys, adds then removes a node, and asserts exactly which few keys moved plus the replica set for a chosen key.

  To keep every value hand-checkable the whole project rides on one deliberately small deterministic hash - FNV-1a folded onto a 16-bit ring - so every node and key sits at a fixed, pinnable position. That is a teaching choice, not a limitation of the design: the ring is hash-agnostic, and swapping in SHA-1 or MD5 (what production systems use) changes only the positions, not a line of the ring logic. It is honest about what it stops short of - it is an in-memory, single-threaded library over one ring with a fixed hash, not a networked, concurrent, rebalancing cluster membership service - which is exactly the core that systems like Amazon Dynamo, Cassandra, and consistent-hashing caches wrap with replication policies, failure detection, and data movement.
parts:
  - name: 'The problem: hashing keys to nodes'
    count: 4
  - name: 'The hash ring'
    count: 4
  - name: 'Fast lookup with a sorted ring'
    count: 3
  - name: 'Adding and removing nodes'
    count: 4
  - name: 'Virtual nodes and load balancing'
    count: 3
  - name: 'Replication and the capstone'
    count: 5
caveats:
  note: 'A complete, well-tested teaching implementation of a single-process, non-concurrent hash ring whose deliberately tiny 16-bit hash is collision-prone by design: ideal for learning consistent hashing by hand, not for running as-is in a real distributed system.'
  future:
    - 'Swap the tiny teaching hash for a wide or pluggable one (SHA-1, MD5) so virtual-node collisions become vanishingly rare and weighting stays exact at scale.'
    - 'Add concurrency safety (a lock or a copy-on-write snapshot) so one ring can be shared safely across threads.'
    - 'Resolve virtual-node position collisions by probing to the next free slot instead of dropping the losing replica.'
    - 'Adjust or remove a single virtual node without a full remove-and-re-add cycle.'
    - 'Wrap the ring in what a real cluster needs around it: a replication policy, failure detection, and actual data movement when membership changes.'
resources:
  - title: 'Consistent Hashing and Random Trees: Distributed Caching Protocols for Relieving Hot Spots on the World Wide Web'
    author: 'David Karger, Eric Lehman, Tom Leighton, Rina Panigrahy, Matthew Levine, Daniel Lewin'
    url: 'https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf'
    note: 'The 1997 paper that introduced consistent hashing - nodes and keys on a shared circle, a key owned by the nearest node clockwise, and the theorem that adding or removing a node moves only O(K/N) keys. The origin of everything in this project.'
  - title: 'Dynamo: Amazon''s Highly Available Key-value Store'
    author: 'Giuseppe DeCandia et al.'
    url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf'
    note: 'The SOSP 2007 paper that made consistent hashing mainstream in production. Read section 4.2 for how Dynamo partitions with a ring, uses virtual nodes for load balance and heterogeneous hardware, and layers replication (the preference list of N nodes) on top - the direction the last chapter of this project points.'
  - title: 'Consistent Hashing (explainer)'
    author: 'Tom White'
    url: 'https://www.tom-e-white.com/2007/11/consistent-hashing.html'
    note: 'A short, well-illustrated walkthrough with a working implementation - the ring as a sorted map, finding the successor, and why virtual nodes matter. The clearest first read after this project.'
  - title: 'A Fast, Minimal Memory, Consistent Hash Algorithm (Jump Consistent Hash)'
    author: 'John Lamping, Eric Veach (Google)'
    url: 'https://arxiv.org/abs/1406.2294'
    note: 'A different point in the design space: no ring and no per-node storage, just a function mapping a key and a bucket count to a bucket with minimal remapping. Read it to see what consistent hashing looks like when you drop the explicit ring - and what you give up (no arbitrary node names or weighting).'
  - title: 'Cassandra: The Definitive Guide'
    author: 'Jeff Carpenter, Eben Hewitt'
    url: 'https://www.oreilly.com/library/view/cassandra-the-definitive/9781098115159/'
    note: 'A production system built on a consistent-hashing token ring with virtual nodes (vnodes) and tunable replication. Useful for seeing the ring, virtual nodes, and replica sets you build here operating at cluster scale.'
---
