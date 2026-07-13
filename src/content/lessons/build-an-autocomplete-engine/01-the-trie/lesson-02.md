---
project: build-an-autocomplete-engine
lesson: 2
title: Inserting a word
overview: A trie is only useful once it holds words. Today you insert one - walking the characters and creating a node for each, then marking where the word ends - so the tree actually takes shape.
goal: Insert a word by walking its characters, creating child nodes as needed, and marking the final node end-of-word.
spec:
  scenario: Inserting a word builds a path of nodes
  status: failing
  lines:
    - kw: Given
      text: 'a new trie'
    - kw: When
      text: 'Insert("cat") is called'
    - kw: Then
      text: 'following children c, then a, then t reaches a node whose end flag is true'
    - kw: And
      text: 'the c node and the a node each have exactly one child'
code:
  lang: go
  source: |
    func (t *Trie) Insert(word string) {
      cur := t.root
      for _, r := range word {
        next, ok := cur.children[r]
        if !ok {
          // no edge for this rune yet - create the child node
          next = &node{children: map[rune]*node{}}
          cur.children[r] = next
        }
        cur = next
      }
      cur.end = true // the word ends at this node
    }
checkpoint: You can insert a word and it becomes a path of nodes ending in an end-of-word marker. Commit and stop here.
---

Inserting is a walk. Start at the root and, for each character of the word, step
to the matching child - creating that child first if no edge exists yet. When the
characters run out, the node you have arrived at *is* the word, so you mark it
`end`. Inserting `cat` from an empty trie creates three new nodes (`c`, `a`, `t`)
in a single chain and flips the last one's `end` to true.

Only the final node is marked `end`; the `c` and `a` nodes are interior points on
the way to `cat`, not words themselves (yet). That distinction - a node on a path
versus a node that ends a word - is what the next lesson leans on to tell a stored
word apart from a mere prefix.
