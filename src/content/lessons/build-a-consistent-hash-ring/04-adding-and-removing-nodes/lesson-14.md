---
project: build-a-consistent-hash-ring
lesson: 14
title: Removing a node moves only its keys
overview: Removal is the mirror image of adding. When a node leaves, only the keys it owned move - and they all go to the same place, the next node clockwise. Today you pin exactly which keys move and confirm the rest stay put.
goal: Show that removing a node reassigns only its own keys, all to its successor.
spec:
  scenario: A leaving node hands its keys to its successor
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha (28075), beta (58567), gamma (5130) and the 12 fruit keys, where gamma owns cherry, grape, kiwi, and mango'
    - kw: When
      text: 'Remove("gamma") is called and MovedKeys compares the assignment before and after'
    - kw: Then
      text: 'MovedKeys is exactly [cherry, grape, kiwi, mango] - only gamma''s four keys move'
    - kw: And
      text: 'all four move to alpha, gamma''s successor clockwise, and the other 8 keys keep their owner'
code:
  lang: go
  source: |
    // Reuse Get before and MovedKeys after Remove.
    // gamma's keys are the ones whose position is past beta (wrapping)
    // or at/below gamma; with gamma gone they wrap to the new lowest
    // node, alpha. Assert the moved set AND that each moved to alpha.
checkpoint: Removing a node moves only its keys, all to the successor. Commit and stop here.
---

Removing a node is the exact reverse of adding one. `gamma` at 5130 owns the keys that
wrap past the top of the ring - `cherry`, `grape`, `kiwi`, `mango`, all sitting above
`beta` (58567). Take `gamma` away and those four keys wrap to the new lowest node,
`alpha`. Crucially, **only** those four move, and they all go to the **same** successor.
The eight keys `gamma` never owned do not shift at all.

That "all to one successor" detail is what makes removal cheap and predictable: a
failed node's entire load lands on its single clockwise neighbor, not scattered across
the cluster. (It is also why an overloaded node can be a problem when its predecessor
fails - a wrinkle virtual nodes smooth out in the next chapter.) With adding and
removing both pinned to a handful of keys, the minimal-remapping promise is proven; the
next lesson puts the ring and modulo side by side to make the contrast unmissable.
