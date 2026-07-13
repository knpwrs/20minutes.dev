---
project: build-a-btree-index
lesson: 17
title: Choosing a child
overview: An internal node routes a search to exactly one child. Today you write that choice - given the separator keys, pick which child page to follow - pinning the rule that a key equal to a separator goes right.
goal: Given an internal node's separator keys, return the index of the child to descend into for a target key.
spec:
  scenario: Routing a key to a child
  status: failing
  lines:
    - kw: Given
      text: 'an internal node with separator keys [20, 40] (and therefore 3 children)'
    - kw: When
      text: the child index for a target key is computed
    - kw: Then
      text: 'target 10 routes to child 0, target 30 routes to child 1, and target 50 routes to child 2'
    - kw: And
      text: 'a target equal to a separator goes right: target 20 routes to child 1 and target 40 routes to child 2'
code:
  lang: go
  source: |
    // follow child i, where i is the count of separators <= target,
    // i.e. the first index whose key is strictly greater than target.
    func childIndex(keys []uint64, target uint64) int {
      i := 0
      // while i < len(keys) && keys[i] <= target { i++ }
      return i
    }
checkpoint: An internal node can route any key to exactly one child. Commit and stop here.
---

Search through the tree is a sequence of these choices: at each internal node, the
separator keys split the key space into ranges, and the target key falls into
exactly one. The rule is that separator `Keys[i]` is the **smallest key in child
`i + 1`'s subtree**, so a key equal to a separator belongs in the **right** child,
not the left. That "equal goes right" convention has to match the leaf split from
last lesson, where the separator was the right leaf's first key.

Concretely, you follow child `i` where `i` is the number of separators less than or
equal to the target - the first child whose upper bound the target does not reach.
With keys `[20, 40]` there are three children covering "below 20", "20 up to 40",
and "40 and above." Getting the equality boundary right is what keeps a key
findable after its leaf has been split away into the right sibling.
