---
project: build-an-autocomplete-engine
lesson: 12
title: Completions with their weights
overview: To rank completions you first need each one paired with its weight. Today you extend the subtree walk to return term-and-weight pairs instead of bare strings.
goal: Return every completion of a prefix paired with its weight, in lexicographic order.
spec:
  scenario: Weighted completions carry each term's score
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cab", 2), Add("car", 5), Add("card", 7), Add("care", 3), Add("cat", 9)'
    - kw: When
      text: 'WeightedCompletions("ca") is called'
    - kw: Then
      text: 'it returns, in lexicographic order by term, the pairs {cab,2}, {car,5}, {card,7}, {care,3}, {cat,9}'
    - kw: And
      text: 'a term added with weight 0 still appears in the list (weight is data, not a filter)'
code:
  lang: go
  source: |
    type Completion struct {
      Term   string
      Weight int
    }
    func (t *Trie) WeightedCompletions(prefix string) []Completion {
      start := t.find(prefix)
      out := []Completion{}
      if start == nil { return out }
      var walk func(n *node, suffix string)
      walk = func(n *node, suffix string) {
        if n.end {
          out = append(out, Completion{prefix + suffix, n.weight})
        }
        for _, r := range sortedRunes(n.children) {
          walk(n.children[r], suffix+string(r))
        }
      }
      walk(start, "")
      return out
    }
checkpoint: You can list a prefix's completions each paired with its weight. Commit and stop here.
---

This is the plain completion walk from chapter two with the payload widened: at
each end-of-word node you now record a `Completion` - the full term plus the
`weight` stored on that node - instead of just the string. The traversal is
identical, so the list still comes out in lexicographic order by term; only the
element type has grown.

Keeping this intermediate list in **lexicographic** order matters: it gives every
later ranking a stable, predictable starting point, so that when two terms tie on
weight the tie is broken the same way every time. Note too that weight is only
data attached to each result - a term added with weight `0` is still a real
completion and must appear. Filtering and ranking are the next lesson's job; this
lesson just makes the weights visible.
