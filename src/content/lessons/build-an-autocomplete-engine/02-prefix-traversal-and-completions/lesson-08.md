---
project: build-an-autocomplete-engine
lesson: 8
title: Completions of a prefix
overview: This is the heart of autocomplete - given a prefix, return every stored word that starts with it. Today you combine the prefix walk with the subtree collection to produce a completion list.
goal: Return all stored words that begin with a given prefix, in lexicographic order.
spec:
  scenario: Completions returns the whole subtree under a prefix
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Insert("car"), Insert("cat"), Insert("cab"), Insert("dog")'
    - kw: When
      text: 'Completions("ca") is called'
    - kw: Then
      text: 'it returns exactly ["cab", "car", "cat"]'
    - kw: And
      text: 'Completions("do") returns exactly ["dog"]'
code:
  lang: go
  source: |
    func (t *Trie) Completions(prefix string) []string {
      start := t.find(prefix) // the subtree root for this prefix
      out := []string{}
      if start == nil {
        return out
      }
      var walk func(n *node, suffix string)
      walk = func(n *node, suffix string) {
        if n.end {
          out = append(out, prefix+suffix) // prepend the prefix we walked
        }
        for _, r := range sortedRunes(n.children) {
          walk(n.children[r], suffix+string(r))
        }
      }
      walk(start, "")
      return out
    }
checkpoint: You can list every word that begins with a prefix, in order. Commit and stop here.
---

Completions is exactly the two pieces you already have, joined: `find` walks to
the node where the prefix ends, and then the depth-first collection from the last
lesson gathers every word in that subtree. The one subtlety is that the walk below
the prefix node only builds the **suffix** - the characters after the prefix - so
you prepend the prefix to each word before recording it. Collecting from the `ca`
node yields suffixes `b`, `r`, `t`, which become `cab`, `car`, `cat`.

That is the query at the centre of the whole engine: type `ca`, get back every
word that could complete it, already in a stable order. Everything from here on
refines this - ranking the list by how popular each word is, making the lookup
fast, and letting it learn - but the shape "walk to the prefix, read its subtree"
never changes. The next lessons pin down its edges.
