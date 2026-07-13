---
project: build-a-consistent-hash-ring
lesson: 12
title: Removing a node
overview: Nodes leave as well as join - a server is decommissioned or fails. Today you build Remove, which pulls a node off the ring, so the ring can shrink as well as grow. This is the machinery the next two lessons use to prove the minimal-remapping payoff.
goal: Remove a node from the ring, deleting its position and reassigning its keys.
spec:
  scenario: A removed node's keys fall to the next node clockwise
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha (28075), beta (58567), gamma (5130), delta (31777) where Get("orange") returns delta'
    - kw: When
      text: 'Remove("delta") is called'
    - kw: Then
      text: 'delta is gone from the sorted positions, which become [5130, 28075, 58567], and Members no longer lists delta'
    - kw: And
      text: 'Get("orange") now returns beta - orange''s owner fell to the next node clockwise'
code:
  lang: go
  source: |
    // Delete every position that maps to this node, then drop it
    // from the owner map. (One position for now; many once vnodes exist.)
    func (r *Ring) Remove(name string) {
      kept := r.positions[:0]
      for _, p := range r.positions {
        if r.owner[p] == name {
          delete(r.owner, p)
        } else {
          kept = append(kept, p)
        }
      }
      r.positions = kept
    }
checkpoint: The ring can remove a node and its position. Commit and stop here.
---

A ring that only grows is not much use; nodes fail and get retired. `Remove` takes a
node off the ring by deleting its position from the sorted slice and dropping it from the
owner map. Everything left stays in sorted order, so lookups keep working with no other
change.

Write the deletion to remove **every** position owned by the node, not just one. Today
each node has a single position so that is one entry, but virtual nodes will give a node
many positions, and a removal must clear all of them - writing it that way now means the
vnode lesson changes nothing here. The immediate effect is exactly what consistent
hashing promises: when `delta` leaves, the keys it held (like `orange` at 29675) fall to
the next node clockwise, `beta`, and no other key notices. The next two lessons pin down
precisely how few keys that is.
