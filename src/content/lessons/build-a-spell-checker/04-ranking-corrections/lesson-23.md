---
project: build-a-spell-checker
lesson: 23
title: The candidate ladder
overview: A good corrector prefers a close word over a far one, and only widens the search when it has to. Today you build Norvig's candidate ladder - known word, then one edit, then two, then give up - returning the first rung that has any real words.
goal: Return the best available tier of candidates - the word itself, else one-edit words, else two-edit words, else the word alone.
spec:
  scenario: Choosing the nearest non-empty tier of candidates
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary containing "the", "ten", "tea", and "cat"'
    - kw: When
      text: 'Candidates is asked for a word'
    - kw: Then
      text: 'Candidates("the") is ["the"] (a known word is its own only candidate)'
    - kw: And
      text: 'Candidates("teh") is ["tea", "ten", "the"] (one-edit tier), and Candidates("xyzzy") is ["xyzzy"] (nothing near, so the word itself)'
code:
  lang: go
  source: |
    func (d *Dictionary) Candidates(word string) []string {
      // first non-empty of:
      //   known word?      -> [word]
      //   known1(word)     -> one-edit real words
      //   known2(word)     -> two-edit real words
      //   fallback         -> [word]
    }
checkpoint: The corrector prefers the nearest tier of real words. Commit and stop here.
---

Norvig's corrector rests on a **priority ladder**: trust a small, near set of
candidates over a large, far one. If the word is already spelled correctly, it is
its own only candidate - no correction needed. Otherwise prefer the real words one
edit away; only if there are none do you widen to two edits; and if even that is
empty, fall back to the word itself (there is nothing better to offer).

This ordering encodes a simple, effective assumption: **fewer edits means more
likely**. A one-edit neighbor almost always beats a two-edit one, whichever is more
frequent, so distance is the outer sort and frequency (next lesson) only decides
*within* the chosen tier. Returning the word itself as the last resort keeps the
corrector total - it always returns something - so the document tool never has to
handle a "no answer" case.
