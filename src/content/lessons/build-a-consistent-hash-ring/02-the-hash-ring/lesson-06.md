---
project: build-a-consistent-hash-ring
lesson: 6
title: The owning node
overview: This is the heart of consistent hashing - the rule that decides which node owns a key. A key is owned by the first node you meet walking clockwise from the key's position. Today you implement that lookup and pin down exactly which node holds each key.
goal: Return the node that owns a key - the first node clockwise from the key's position.
spec:
  scenario: A key is owned by the first node clockwise
  status: failing
  lines:
    - kw: Given
      text: 'a ring with nodes alpha (28075), beta (58567), and gamma (5130)'
    - kw: When
      text: 'Get is called for apple (position 10943) and for orange (position 29675)'
    - kw: Then
      text: 'Get("apple") returns alpha (the first node at or clockwise-after 10943) and Get("orange") returns beta'
    - kw: And
      text: 'Get on a ring with no nodes returns ("", false)'
code:
  lang: go
  source: |
    // Scan nodes in ring order for the first position >= the key's.
    func (r *Ring) Get(key string) (string, bool) {
      if len(r.positions) == 0 {
        return "", false // nobody to own it
      }
      kp := Pos(key)
      // walk positions in sorted order; pick the first one at or after kp
      // (wraparound past the top is the next lesson)
    }
checkpoint: The ring answers who owns a key by walking clockwise. Commit and stop here.
---

Here is the rule that makes the whole scheme work. Put the key on the ring, then walk
**clockwise** (toward higher positions) until you hit a node - that node owns the key.
`apple` sits at 10943; the nodes clockwise from there are `alpha` (28075) then `beta`
(58567), so `apple` belongs to `alpha`, the nearer one. `orange` at 29675 has already
passed `alpha`, so its first node clockwise is `beta`.

Concretely, "first node clockwise" means the smallest node position that is greater than
or equal to the key's position. Scan the nodes in ring order and return the first one
that qualifies. Two details matter from day one: a ring with **no nodes** owns nothing,
so `Get` must report that cleanly rather than crash, and a key that sits past every node
has to wrap around the top back to the first node - that wraparound is the next lesson,
so for now use keys that land before the last node.
