---
project: build-a-consistent-hash-ring
lesson: 22
title: Assigning a keyset with backups
overview: Before the finale, put replication to work on a whole batch of keys - every key gets a primary and a backup. Today you assign the fruit keyset with R=2 and see that each key lands on two distinct nodes, the shape of a real replicated placement.
goal: Assign every key in a set to a distinct primary and backup node.
spec:
  scenario: Every key gets two distinct holders
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha, beta, gamma, delta (one position each) and the 12 fruit keys'
    - kw: When
      text: 'Replicas(key, 2) is computed for every key'
    - kw: Then
      text: 'each key maps to exactly 2 distinct nodes - for example apple to [alpha, delta] and cherry to [gamma, alpha]'
    - kw: And
      text: 'across all 12 keys there are 24 placements in total (12 primaries plus 12 backups), and no key lists the same node twice'
code:
  lang: go
  source: |
    // Run Replicas(k, 2) over the keyset; collect a primary and a
    // backup per key. Assert len(set)==2 and set[0]!=set[1] for each,
    // and that the placements total 24 across the 12 keys.
    for _, k := range fruits { rs := ring.Replicas(k, 2) /* ... */ }
checkpoint: The keyset is placed with a primary and a backup each. Commit and stop here.
---

Replication only matters in bulk, so here you place a whole keyset. With `R=2`, every one
of the twelve keys gets a primary and one backup - `apple` on `alpha` with a backup on
`delta`, `cherry` on `gamma` with a backup on `alpha`, and so on. The rule that each
replica set holds distinct nodes means every key genuinely lives on two different
machines, so any single node failing leaves a copy of every key it held somewhere else.

Counting placements is a quick way to see the shape of the whole assignment: twelve keys
times two copies is **24 placements**, spread across the four nodes. Backups pile up on a
node's clockwise successor - the keys `beta` is primary for get their backups on `gamma`,
and so on - which is why a node failing shifts its primary load onto exactly the
neighbors already holding the backups. That is the placement a replicated store actually
runs on, and you can now compute it for any keyset. One lesson left: put every piece
together through a full round of node churn.
