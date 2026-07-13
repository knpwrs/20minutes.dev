---
project: build-a-consistent-hash-ring
lesson: 9
title: Sorted node positions
overview: The clockwise walk needs the nodes in ring order, and re-sorting on every lookup would be wasteful. Today you keep the node positions sorted as they are added, so the ring is always ready to search - the setup that makes fast lookup possible next lesson.
goal: Keep node positions in a sorted slice as nodes are added.
spec:
  scenario: Node positions stay sorted after each add
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha, beta, gamma to which delta (position 31777) is added'
    - kw: When
      text: 'the ring reports its sorted positions'
    - kw: Then
      text: 'the positions are [5130, 28075, 31777, 58567] in order (gamma, alpha, delta, beta)'
    - kw: And
      text: 'Get still returns the same owners as before, for example Get("orange") returns delta now that delta sits at 31777'
code:
  lang: go
  source: |
    // On Add, insert the new position so the slice stays sorted.
    func (r *Ring) Add(name string) {
      p := Pos(name)
      i := sort.Search(len(r.positions), func(i int) bool { return r.positions[i] >= p })
      r.positions = append(r.positions, 0)
      copy(r.positions[i+1:], r.positions[i:])
      r.positions[i] = p
      r.owner[p] = name
    }
checkpoint: Node positions are always sorted in ring order. Commit and stop here.
---

The clockwise walk only makes sense over nodes in ring order, and so far `Members` and
`Get` have had to sort on demand. Better to keep the `positions` slice **sorted as an
invariant**: every time a node is added, drop its position into the right spot so the
slice is always in ring order. Adding `delta` at 31777 slides it between `alpha` (28075)
and `beta` (58567), giving `[5130, 28075, 31777, 58567]`.

This is pure setup with a real payoff coming: a sorted slice can be searched in
logarithmic time instead of scanned linearly, which is the next lesson. Keep the change
behavior-preserving - `Get` must return exactly what it did before, just reading from an
already-sorted slice. One thing to confirm while you are here: now that `delta` sits at
31777, `orange` (29675) finds `delta` as its first node clockwise, where before it found
`beta`. That is the ring quietly doing the right thing, and a preview of chapter four.
