---
project: build-a-spell-checker
lesson: 28
title: Searching within a radius
overview: This is the payoff of the tree - finding every word within k edits while visiting only a few nodes. Today you build the radius query that uses the triangle inequality to prune whole branches.
goal: Return every word in the tree within k edits of a query, skipping children whose edge is outside the reachable band.
spec:
  scenario: A pruned radius search
  status: failing
  lines:
    - kw: Given
      text: 'a tree built from "book", "books", "back", "boo", "cook", "cake"'
    - kw: When
      text: 'the tree is searched for words within 1 edit of "book"'
    - kw: Then
      text: 'it returns ["boo", "books", "cook"] (sorted), each exactly 1 edit from "book", excluding "book" itself'
    - kw: And
      text: 'the search never descends into the "back" or "cake" branches, because their edges from the root fall outside the band [d-1, d+1]'
code:
  lang: go
  source: |
    // at a node, let d = Distance(query, node.Word).
    // include node.Word if 1 <= d <= k. Then only recurse into
    // children whose edge label is in [d-k, d+k] - the triangle
    // inequality guarantees nothing reachable lies outside that band.
    func (n *BKNode) Within(query string, k int) []string { /* ... */ }
checkpoint: The radius search finds near words while pruning far branches. Commit and stop here.
---

Here is why the tree exists. To find every word within `k` edits of a query, you
walk from the root, but at each node you **prune**. Compute `d = Distance(query,
node)`; by the **triangle inequality**, any word in the child at edge `e` has
distance to the query between `|d - e|` and `d + e`. So a child can only contain a
match if its edge lies in the band `[d - k, d + k]` - every other child is skipped
entirely, subtree and all.

For `Within("book", 1)`, the root's `back` (edge 2) and `cake` (edge 4) are outside
`[−1, 1]`, so those branches are never even looked at; the search visits only the
handful of nodes that could hold a match and returns `boo`, `books`, `cook`. On a
real dictionary this prunes away the overwhelming majority of words per query - the
difference between scanning 100,000 words and touching a few hundred. Excluding
distance 0 keeps a correctly-spelled query from matching itself, exactly as
`Nearby` did.
