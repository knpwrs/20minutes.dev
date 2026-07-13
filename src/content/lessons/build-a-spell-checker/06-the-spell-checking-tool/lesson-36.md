---
project: build-a-spell-checker
lesson: 36
title: Only checking real words
overview: Not every token is a word to spell-check - an all-caps acronym like "NASA" is not a typo. Today you teach the checker to skip acronyms so it stops flagging things that are spelled fine on purpose.
goal: Skip all-uppercase multi-letter tokens so acronyms are never flagged as misspellings.
spec:
  scenario: Acronyms are not checked
  status: failing
  lines:
    - kw: Given
      text: 'a Checker over a dictionary containing "the"'
    - kw: When
      text: 'Check("NASA teh") is called'
    - kw: Then
      text: 'it returns one Issue, for "teh" (corrected to "the")'
    - kw: And
      text: '"NASA" produces no Issue, because an all-uppercase word of two or more letters is treated as an acronym'
code:
  lang: go
  source: |
    // before flagging a token, decide if it is even checkable
    func isCheckable(word string) bool {
      // an all-upper-case token of length >= 2 is an acronym - skip it
      // (single letters like "I" and ordinary words stay checkable)
    }
checkpoint: Acronyms are left alone while ordinary words are still checked. Commit and stop here.
---

A checker that flags `NASA`, `HTML`, and `PDF` on every page is annoying and wrong -
those are not misspellings, they are **acronyms**, deliberately all-caps. A cheap,
effective rule catches most of them: a token that is entirely upper-case and at
least two letters long is almost certainly an initialism, not a typo, so the checker
skips it before ever consulting the dictionary.

This is the first real judgment the tool makes about *what counts as a word to
check*, and it is deliberately conservative - it only exempts a narrow, obvious
class, leaving `I` and ordinary Capitalized or lower-case words fully checked. Real
checkers extend this idea with more skip rules (URLs, code, numbers with units), but
the principle is the same: filter out the tokens that are not prose words before
spending effort correcting them. The next lesson turns to *where* a flagged word is,
in human terms.
