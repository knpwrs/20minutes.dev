---
project: build-a-consistent-hash-ring
lesson: 7
title: Wrapping past the top
overview: A ring is a circle, so a key sitting past the last node has to come back around to the first. Today you handle that wraparound, the case that makes the ring truly circular rather than just a sorted line.
goal: Own a key that falls past the last node by wrapping to the first node.
spec:
  scenario: A key past the last node wraps to the first
  status: failing
  lines:
    - kw: Given
      text: 'a ring with nodes alpha (28075), beta (58567), and gamma (5130), where beta is the last node clockwise'
    - kw: When
      text: 'Get is called for cherry (position 59512, past beta)'
    - kw: Then
      text: 'Get("cherry") returns gamma - the walk wraps past the top of the ring to the lowest-positioned node'
    - kw: And
      text: 'on a ring with only alpha, every key wraps to alpha, so Get("cherry") and Get("apple") both return alpha'
code:
  lang: go
  source: |
    // If no node sits at or after the key, wrap: the owner is the
    // lowest-positioned node (index 0 in ring order).
    // scan for first position >= kp ...
    // if none found:
    //   return the first node on the ring
checkpoint: Keys past the last node wrap correctly to the first node. Commit and stop here.
---

The ring closes on itself, so position 65535 is immediately followed by position 0.
`cherry` sits at 59512, past `beta` (58567, the highest node), so there is no node
clockwise before the top of the ring. Walking clockwise you fall off the top, reappear
at 0, and the first node you meet is `gamma` at 5130 - the lowest-positioned node. So
`cherry` belongs to `gamma`.

In code this is the "no node at or after the key" branch: when the clockwise scan finds
nothing, the owner is simply the first node in ring order. The single-node ring is the
cleanest way to see it - with only `alpha` on the ring, every key either finds `alpha`
directly or wraps around to it, so **every** key lands on `alpha`. That is also a
reassuring sanity check: one node owns the entire keyspace, exactly as it should.
