---
project: build-an-autocomplete-engine
lesson: 6
title: Walking to a prefix
overview: Every completion query starts by finding the node where a prefix ends - the root of the subtree holding its completions. Today you build that walk and expose HasPrefix on top of it.
goal: Walk the trie to the node ending a prefix, and report whether any word starts with that prefix.
spec:
  scenario: HasPrefix follows the prefix path
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Insert("cat") and Insert("car")'
    - kw: When
      text: 'HasPrefix is queried'
    - kw: Then
      text: 'HasPrefix("ca") is true and HasPrefix("cat") is true (a word is a prefix of itself)'
    - kw: And
      text: 'HasPrefix("dog") is false and HasPrefix("cats") is false (the path runs off the tree)'
code:
  lang: go
  source: |
    // the shared primitive: walk to the node ending prefix, or nil if absent
    func (t *Trie) find(prefix string) *node {
      cur := t.root
      for _, r := range prefix {
        next, ok := cur.children[r]
        if !ok {
          return nil
        }
        cur = next
      }
      return cur
    }
    func (t *Trie) HasPrefix(prefix string) bool { return t.find(prefix) != nil }
checkpoint: You can walk to a prefix node and answer whether any word starts with a prefix. Commit and stop here.
---

`find` is the workhorse of the rest of the project: it walks the prefix's
characters exactly like `Contains` does, but instead of asking about the `end`
flag it just returns the node it lands on - the root of the subtree containing
every word that starts with that prefix - or `nil` if the path breaks partway.

`HasPrefix` is then a one-liner: a prefix exists if `find` returns a node. Note
the difference from `Contains`: `HasPrefix("ca")` is true even though `ca` is not
a stored word, because words *do* start with `ca`; and `HasPrefix("cats")` is
false because the walk runs off the end of the `cat` path. That returned node is
the door to completions - the next lessons collect everything hanging below it.
