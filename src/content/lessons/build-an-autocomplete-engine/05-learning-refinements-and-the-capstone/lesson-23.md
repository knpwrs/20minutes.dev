---
project: build-an-autocomplete-engine
lesson: 23
title: Multi-word phrase terms
overview: Autocomplete terms are often phrases, not single words - "new york", "new jersey". Today you confirm the engine already handles them, because a space is just another character on the path, and a mid-phrase prefix completes correctly.
goal: Complete multi-word terms from a prefix that spans a space, distinguishing it from a prefix that stops before the space.
spec:
  scenario: A prefix can reach into a phrase
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("new york", 5), Add("new jersey", 3), Add("newark", 4)'
    - kw: When
      text: 'Suggest is called with word and phrase prefixes'
    - kw: Then
      text: 'Suggest("new", 3) returns ["new york", "newark", "new jersey"] (all three, ranked by weight)'
    - kw: And
      text: 'Suggest("new ", 2) - with the trailing space - returns ["new york", "new jersey"], because newark has no space after new'
code:
  lang: go
  source: |
    // No new code: a space is an ordinary rune in the key, so the phrase
    // "new york" is just the path n-e-w-space-y-o-r-k. The prefix "new "
    // walks through the space and excludes "newark", whose fourth rune is 'a'.
    // This lesson pins that phrases and mid-phrase prefixes already work.
checkpoint: The engine completes multi-word phrase terms, including prefixes that span a space. Commit and stop here.
---

Nothing in the trie ever assumed a term was a single word. A space is just another
rune, so `new york` is stored as the path `n-e-w-space-y-o-r-k`, and every
operation - insert, prefix walk, completion, ranking - treats it like any other
character. Typing `new` completes to all three terms that start with it, ranked by
weight; the engine does not care that two of them contain a space.

The interesting boundary is the space itself. The prefix `new ` (trailing space)
walks past the space, so it only reaches terms that actually have a space there -
`new york` and `new jersey` - and excludes `newark`, whose fourth character is `a`,
not a space. This is why phrase autocomplete works for free: the space is a
first-class character in the key, so a person can keep typing straight through it
and the completions narrow exactly as they should.
