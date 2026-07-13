---
project: build-a-search-engine
lesson: 5
title: Stemming to a root
overview: Today you strip common suffixes so that "jumping", "jumped", and "jumps" all reduce to one root term. This lets a query for one form match documents that used another.
goal: Reduce a token to a root by stripping a common suffix.
spec:
  scenario: Stripping suffixes to a shared root
  status: failing
  lines:
    - kw: Given
      text: 'the words "jumping", "jumped", "cats", and "class"'
    - kw: When
      text: each is stemmed
    - kw: Then
      text: '"jumping" and "jumped" both stem to "jump"'
    - kw: And
      text: '"cats" stems to "cat", but "class" stays "class"'
code:
  lang: python
  source: |
    def stem(word):
        # try suffixes longest-first; guard so short words survive
        # -ing / -ed / plural -s ; but never strip -ss
        ...
reading: 'M. F. Porter, "An algorithm for suffix stripping" (1980).'
checkpoint: Word variants collapse to a shared root, so different inflections match. Commit and stop here.
---

**Stemming** trims inflectional endings so that related words meet at a common
root. A full stemmer like Porter's has dozens of rules; yours needs only a few to
show the idea. Apply them longest-suffix first: strip `-ing`, then `-ed`, then a
trailing plural `-s`.

The interesting cases are the guards. Only strip a suffix if enough word remains
(so `is` does not become the empty string), and never strip the `-s` from a word
ending in `-ss` like `class`, or you would mangle it. This crude stemmer will
sometimes over-trim - that is a known trade-off, and consistency matters more than
linguistic perfection, because the same rule runs on queries too.
