---
project: build-a-consistent-hash-ring
lesson: 8
title: Distributing a keyset
overview: With ownership working, you can finally watch the ring do its job on a whole batch of keys at once. Today you count how many keys land on each node - and see that a plain ring spreads load unevenly, which sets up the case for virtual nodes later.
goal: Count how many keys each node owns across a set of keys.
spec:
  scenario: A keyset spreads unevenly across three nodes
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha, beta, gamma and the 12 fruit keys from lesson 4'
    - kw: When
      text: 'Distribution returns a map of node name to the count of keys it owns'
    - kw: Then
      text: 'alpha owns 2 keys, beta owns 6, and gamma owns 4'
    - kw: And
      text: 'the counts sum to 12 and alpha owns exactly apple and lemon'
code:
  lang: go
  source: |
    // Tally owners across the whole keyset by reusing Get.
    func (r *Ring) Distribution(keys []string) map[string]int {
      counts := map[string]int{}
      for _, k := range keys {
        if node, ok := r.Get(k); ok {
          counts[node]++
        }
      }
      return counts
    }
checkpoint: The ring reports how keys spread across nodes. Commit and stop here.
---

Now that every key has an owner, a natural question is how evenly the load is spread.
`Distribution` just runs `Get` over a whole keyset and tallies the results. With three
nodes and twelve keys, a perfectly even split would be four each - but the ring gives
**2, 6, 4**. `beta` owns half the keys because the arc of the ring leading up to it
(from `alpha` at 28075 all the way to `beta` at 58567) is the widest gap between two
nodes, and every key that falls in a node's arc belongs to that node.

That unevenness is not a bug; it is the honest behavior of a ring with only three
points on it. Load on a node is proportional to the size of the arc behind it, and with
few nodes those arcs vary wildly. This is exactly the weakness that **virtual nodes**
fix in chapter five, by giving each node many small arcs instead of one big one. For
now, you have a working end-to-end ring: place nodes, place keys, and see where
everything lands.
