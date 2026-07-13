---
project: build-a-consistent-hash-ring
lesson: 5
title: Placing nodes on the ring
overview: Now the ring gets its residents. A node takes a position on the ring by hashing its name, exactly like a key does. Today you build the Ring type and place nodes on it, so the ring knows who lives where.
goal: Build a Ring that places named nodes at their hashed positions.
spec:
  scenario: Added nodes sit at their hashed positions
  status: failing
  lines:
    - kw: Given
      text: 'a new ring with nodes added in the order beta, gamma, alpha'
    - kw: When
      text: 'the ring reports each node position with Pos and lists its Members'
    - kw: Then
      text: 'alpha is at 28075, beta at 58567, and gamma at 5130'
    - kw: And
      text: 'Members returns the three node names sorted by position: gamma, alpha, beta'
code:
  lang: go
  source: |
    type Ring struct {
      positions []uint16          // node positions, we will keep these sorted later
      owner     map[uint16]string // position -> node name
    }
    func NewRing() *Ring { return &Ring{owner: map[uint16]string{}} }
    func (r *Ring) Add(name string) {
      p := Pos(name)
      r.positions = append(r.positions, p)
      r.owner[p] = name
    }
    // Members: node names ordered by ring position.
checkpoint: The ring places named nodes at their hashed positions. Commit and stop here.
---

A hash ring puts **nodes and keys in the same space**. A node joins the ring by hashing
its own name with the very same `Pos` function a key uses, so `alpha` sits at position
28075 and `gamma` sits at 5130. That shared space is the whole trick: to find a key's
node we will just compare their positions on one circle.

Today the ring only needs to remember where each node sits. Store the positions and a
map from position back to node name - you will look up nodes by position constantly.
Notice that the order nodes are *added* does not matter; what matters is their order
*around the ring* by position, which is why `Members` sorts by position rather than by
insertion. Nodes `alpha`, `beta`, `gamma` are the cast for the next several lessons, so
keep those exact positions handy.
