---
project: build-an-autocomplete-engine
lesson: 1
title: The trie node and an empty engine
overview: Autocomplete needs a data structure that shares work across words with common prefixes. That structure is a trie - a tree where each edge is a character. Today you define its node and create an empty engine that knows it holds nothing yet.
goal: Define a trie node keyed by character and create an empty trie that reports zero words.
spec:
  scenario: A new trie starts empty
  status: failing
  lines:
    - kw: Given
      text: 'a new trie created with NewTrie()'
    - kw: When
      text: 'its Len is queried'
    - kw: Then
      text: 'it reports 0'
    - kw: And
      text: 'the root node has no children and is not marked end-of-word'
code:
  lang: go
  source: |
    // one node per character position; children keyed by the next rune
    type node struct {
      children map[rune]*node
      end      bool // true when a word ends exactly here
      weight   int  // a term's rank score; unused until later, leave 0
    }
    type Trie struct {
      root *node
      size int
    }
    func NewTrie() *Trie { return &Trie{root: &node{children: map[rune]*node{}}} }
    func (t *Trie) Len() int { return t.size }
checkpoint: You have an empty trie with a root node and a word count of zero. Commit and stop here.
---

A **trie** (pronounced "try", from re*trie*val) is a tree that stores strings by
their characters: the root is the empty string, and following an edge labelled
`c` moves to the node for every word that has `c` at that position. Words that
share a prefix share the nodes for that prefix, which is exactly what makes a trie
the natural home for autocomplete - the completions of `ca` are everything in the
subtree hanging off the `c`-then-`a` node.

Today is deliberately tiny: one `node` type whose `children` map is keyed by the
next character, an `end` flag marking where a word finishes, and the `Trie` that
owns the root and a running word count. The `weight` field is along for the ride -
later lessons rank completions by it, so we reserve it now and leave it `0`. Every
later lesson grows this same tree.
