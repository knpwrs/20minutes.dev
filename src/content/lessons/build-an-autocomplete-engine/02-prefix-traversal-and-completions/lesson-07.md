---
project: build-an-autocomplete-engine
lesson: 7
title: Listing every word in order
overview: To collect completions you first need to walk a subtree and gather the words in it. Today you build that depth-first collection and prove it returns words in deterministic lexicographic order by visiting child characters sorted.
goal: Return every stored word by a depth-first walk that visits children in sorted character order.
spec:
  scenario: Words are listed in lexicographic order
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Insert("cat"), Insert("dog"), Insert("car"), Insert("cab") inserted in that order'
    - kw: When
      text: 'Words() is called'
    - kw: Then
      text: 'it returns exactly ["cab", "car", "cat", "dog"]'
    - kw: And
      text: 'the order is lexicographic regardless of insertion order, because children are visited sorted'
code:
  lang: go
  source: |
    func (t *Trie) Words() []string {
      out := []string{}
      var walk func(n *node, prefix string)
      walk = func(n *node, prefix string) {
        if n.end {
          out = append(out, prefix)
        }
        for _, r := range sortedRunes(n.children) { // deterministic order
          walk(n.children[r], prefix+string(r))
        }
      }
      walk(t.root, "")
      return out
    }
    // sortedRunes returns the child runes of n in ascending order.
checkpoint: You can list every stored word in lexicographic order. Commit and stop here.
---

Collecting words is a **depth-first walk** that builds up the string as it
descends: at each node, if `end` is set the accumulated characters spell a stored
word, so record it; then recurse into the children. Because a `map` has no
inherent order, the one thing you must not skip is **sorting the child runes**
before recursing - that is what makes the output deterministic and lexicographic,
which every later spec relies on.

Visiting children in ascending character order means a whole subtree comes out
sorted: from the root you descend into `c` before `d`, and within `c` you reach
`cab` before `car` before `cat`. Insertion order (`cat`, `dog`, `car`, `cab`)
does not matter at all. This exact traversal, started from a *prefix* node instead
of the root, is the next lesson's completions.
