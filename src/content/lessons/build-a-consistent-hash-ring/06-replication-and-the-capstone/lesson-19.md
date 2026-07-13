---
project: build-a-consistent-hash-ring
lesson: 19
title: The replica set
overview: Real systems store each key on more than one node so a single failure loses nothing. The ring answers this too - a key's replica set is the next R distinct nodes clockwise. Today you build Replicas, walking the ring to collect R owners.
goal: Return the R distinct nodes that should hold a key, walking clockwise from it.
spec:
  scenario: A key maps to the next R nodes clockwise
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha (28075), beta (58567), gamma (5130), delta (31777), sorted [gamma, alpha, delta, beta]'
    - kw: When
      text: 'Replicas(key, r) walks clockwise from the key collecting distinct node names'
    - kw: Then
      text: 'Replicas("apple", 3) returns [alpha, delta, beta] and Replicas("orange", 2) returns [delta, beta]'
    - kw: And
      text: 'the walk wraps past the top: Replicas("banana", 2) returns [beta, gamma]'
code:
  lang: go
  source: |
    func (r *Ring) Replicas(key string, count int) []string {
      // start at the successor index (same as Get), then step
      // clockwise, appending each new distinct node until you have
      // count of them or you have been all the way around.
      kp := Pos(key)
      i := sort.Search(len(r.positions), func(i int) bool { return r.positions[i] >= kp })
      // i may equal len(positions): wrap with modulo as you step
    }
checkpoint: The ring returns a key's R-node replica set. Commit and stop here.
---

Storing a key on a single node means one failure loses it, so systems keep `R` copies.
The ring places them by extending the ownership walk: instead of stopping at the first
node clockwise, keep walking and collect the next `R` nodes. `apple` at 10943 hits
`alpha` first, then `delta` (31777), then `beta` (58567), so its 3-node replica set is
`[alpha, delta, beta]`. The first node is the primary (the same answer `Get` gives), and
the rest are backups, in clockwise order.

Two things keep the walk honest. It **wraps** around the top just like `Get`, so
`banana` at 40784 collects `beta` and then wraps to `gamma`. And it collects **distinct
nodes** - each physical node appears at most once in a replica set, which is the point of
replication (three copies on the same machine is one failure from losing all three). On
this one-position-per-node ring every step lands on a new node so distinctness is
automatic, but building it in now is what makes the set correct once virtual nodes put
the same node at several positions.
