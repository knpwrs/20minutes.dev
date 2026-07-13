---
project: build-an-autocomplete-engine
lesson: 9
title: A prefix that is itself a word
overview: A prefix can also be a stored word in its own right, and autocomplete should offer it as one of its own completions. Today you confirm the exact case where the prefix node is marked end-of-word.
goal: Include the prefix itself in its completions when the prefix is a stored word.
spec:
  scenario: The prefix appears among its own completions
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Insert("car"), Insert("card"), Insert("care")'
    - kw: When
      text: 'Completions("car") is called'
    - kw: Then
      text: 'it returns exactly ["car", "card", "care"]'
    - kw: And
      text: 'car appears first because the empty suffix (the prefix itself) sorts before any longer word'
code:
  lang: go
  source: |
    // No new code if lesson 8 is right: the walk starts AT the prefix node,
    // and that node's own end flag is checked first (suffix == ""), so a prefix
    // that is a word is emitted as prefix+"" before any child is visited.
    // This lesson pins that behavior with a test.
checkpoint: A prefix that is also a stored word is included in its own completion list. Commit and stop here.
---

When you call `Completions("car")` on a trie that stored `car`, the subtree walk
starts *at* the `car` node - and the very first thing it does is check that node's
`end` flag. Because `car` was stored, `end` is true and the empty suffix is
recorded, producing `car` itself. Then it descends into the `d` and `e` children
for `card` and `care`.

The ordering falls out naturally: the empty suffix `""` sorts before any
non-empty one, so the prefix-word always leads its own completions -
`car`, then `card`, then `care`. This matters for real autocomplete: if you have
typed a complete word that is also the start of longer ones, the engine should
still offer the word you have already typed as a valid choice, not silently drop
it in favour of the longer completions.
