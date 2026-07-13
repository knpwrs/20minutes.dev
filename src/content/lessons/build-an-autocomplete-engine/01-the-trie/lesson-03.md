---
project: build-an-autocomplete-engine
lesson: 3
title: Membership lookup
overview: Storing a word is only half the contract - you also need to ask whether a word is present. Today you add Contains, which must tell a stored word apart from a path that merely exists as a prefix of another word.
goal: Report whether an exact word was stored, distinguishing it from a mere prefix.
spec:
  scenario: Contains matches only whole stored words
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Insert("cat") and Insert("car")'
    - kw: When
      text: 'Contains is queried'
    - kw: Then
      text: 'Contains("cat") is true and Contains("car") is true'
    - kw: And
      text: 'Contains("ca") is false (a prefix, not a stored word), Contains("cart") is false, and Contains("dog") is false'
code:
  lang: go
  source: |
    func (t *Trie) Contains(word string) bool {
      cur := t.root
      for _, r := range word {
        next, ok := cur.children[r]
        if !ok {
          return false // ran off the tree - no such path
        }
        cur = next
      }
      // the path exists; it is a WORD only if this node ends one
      return cur.end
    }
checkpoint: You can ask whether an exact word is stored, and a bare prefix answers false. Commit and stop here.
---

`Contains` walks the same edges `Insert` did. If at any character there is no
child, the word was never stored and you return false immediately. If the walk
finishes, you have found the *path* - but a path is not a word. `ca` is a path
in a trie holding `cat` and `car`, yet nobody stored `ca`, so its node's `end`
flag is false and `Contains("ca")` must be false.

This is the whole point of the `end` marker: without it a trie could only answer
"is this a prefix of something?", never "is this an actual word?". The next
lesson looks at what happens where words branch, and later chapters turn "is this
a prefix?" into the completions that power autocomplete.
