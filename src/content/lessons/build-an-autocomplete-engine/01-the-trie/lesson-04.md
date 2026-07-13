---
project: build-an-autocomplete-engine
lesson: 4
title: Shared prefixes branch
overview: The reason a trie is efficient is that words sharing a prefix share nodes, splitting only where they differ. Today you pin that branching down - and confirm that inserting the same word twice changes nothing.
goal: Show that words with a common prefix share nodes and branch only where they differ, and that re-inserting a word is a no-op.
spec:
  scenario: A common prefix is shared and branches at the difference
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Insert("car"), Insert("cart"), and Insert("care")'
    - kw: When
      text: 'the node reached by following c, a, r is inspected'
    - kw: Then
      text: 'that node is marked end-of-word (car is a word) and has exactly two children, t and e'
    - kw: And
      text: 'calling Insert("car") again leaves that node with exactly two children and end still true'
code:
  lang: go
  source: |
    // no new code today if Insert is right - this lesson pins the structure.
    // Reuse Insert from lesson 2; walk to the "car" node in a test and assert
    // its child runes are exactly {'t','e'} and end is true. Re-inserting "car"
    // finds every node already present, so it creates nothing new.
checkpoint: Words sharing a prefix share nodes and branch only at the first difference; re-inserting is harmless. Commit and stop here.
---

`car`, `cart`, and `care` all begin `c-a-r`, so they travel the same three nodes
and only then split: `cart` adds a `t` child, `care` adds an `e` child, and `car`
itself is a word, so the shared node carries an `end` marker too. That single
node doing three jobs at once - ending one word and branching to two others - is
the sharing that makes a trie compact and makes "everything under this prefix" a
cheap subtree walk later.

Re-inserting `car` is worth checking because `Insert` must be **idempotent**: each
character already has an edge, so the loop finds existing children and creates no
duplicates, and setting an already-true `end` to true again is a no-op. A trie
that quietly grew a second parallel path for a repeated word would corrupt every
later count and completion, so confirm it does not.
