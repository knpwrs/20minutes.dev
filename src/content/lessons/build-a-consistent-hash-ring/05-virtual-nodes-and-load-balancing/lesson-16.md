---
project: build-a-consistent-hash-ring
lesson: 16
title: Virtual nodes
overview: A node with one position on the ring gets one arc, and those arcs are wildly uneven. Virtual nodes fix that by placing each physical node at many positions - and every one of them resolves back to the same physical node. Today you place a node at V positions.
goal: Place each node at V positions on the ring, all resolving to the physical node.
spec:
  scenario: A node occupies several positions that all resolve to it
  status: failing
  lines:
    - kw: Given
      text: 'AddWeighted(name, v) that places node name at v positions - replica 0 at Pos(name), and replica i>=1 at Pos of the label i + "-" + name'
    - kw: When
      text: 'alpha, beta, gamma are each added with v=2, giving the extra positions 1-alpha at 39205, 1-beta at 19609, and 1-gamma at 53800'
    - kw: Then
      text: 'Get("orange") (29675) returns alpha, because its successor is the virtual node 1-alpha at 39205, which resolves to physical alpha'
    - kw: And
      text: 'the assignment shifts from the one-position ring: apple moves from alpha to beta, and Get("apple") now returns beta'
code:
  lang: go
  source: |
    func vnodeKey(name string, i int) string {
      if i == 0 {
        return name // replica 0 keeps the bare name (V=1 == the plain ring)
      }
      return fmt.Sprintf("%d-%s", i, name)
    }
    func (r *Ring) AddWeighted(name string, v int) {
      for i := 0; i < v; i++ {
        p := Pos(vnodeKey(name, i))
        // if p is already occupied (a rare collision on our tiny ring),
        // skip it; otherwise insert p sorted and set owner[p] = name
        // (the PHYSICAL node). Skipping keeps positions unique.
      }
    }
    func (r *Ring) Add(name string) { r.AddWeighted(name, 1) }
checkpoint: Each node now occupies V ring positions that all resolve to it. Commit and stop here.
---

A physical node's load depends on the size of the arc behind its single position, and
with few nodes those arcs are lopsided - `beta` owned half the keys last chapter.
**Virtual nodes** (vnodes) break that up: place each physical node at several positions
around the ring, so it owns several small arcs instead of one big one. Each virtual
position is just the node's name with a replica index folded in - `1-alpha`, `2-alpha`,
and so on - hashed like anything else, and the ring maps every one of them back to the
physical node `alpha`.

The label scheme is worth a look. Replica 0 keeps the bare name so a node added with
`v=1` sits exactly where it did before - the plain ring is just the vnode ring with one
replica each. Replicas 1 and up put the index **in front** of the name; that matters on
our tiny hash, because varying the last character barely moves the position, while
varying the front scatters the replicas across the ring the way we want. The immediate
effect: with `v=2`, `orange` now finds the virtual node `1-alpha` at 39205 as its
successor, so it resolves to `alpha` - a different owner than the one-position ring gave,
because the ring's geography has changed.

One housekeeping detail matters once a node has many positions: on our tiny 16-bit ring
two virtual positions can occasionally hash to the same spot, so when a position is
already occupied, skip it rather than stacking a second entry there. Keeping positions
unique keeps removal clean and makes the exact key counts in the next two lessons
reproducible.
