---
project: build-a-spell-checker
lesson: 6
title: Keeping contractions whole
overview: 'A contraction like "don''t" is one word, not "don" plus "t". Today you teach the tokenizer to keep an apostrophe inside a word, but only when it sits between letters, so contractions survive and stray quotes do not.'
goal: Treat an apostrophe as part of a word when it falls between two letters, and as a separator otherwise.
spec:
  scenario: Handling apostrophes inside and around words
  status: failing
  lines:
    - kw: Given
      text: 'the text "don''t stop"'
    - kw: When
      text: it is tokenized with positions
    - kw: Then
      text: 'the tokens are {text:"don''t", start:0} and {text:"stop", start:6}'
    - kw: And
      text: 'for "James'' cat" the tokens are {text:"James", start:0} and {text:"cat", start:7} - the trailing apostrophe is dropped'
code:
  lang: go
  source: |
    // an apostrophe continues the current word ONLY if we are already
    // inside a word AND the next character is a letter; otherwise it
    // ends the word like any other separator
    func isWordApostrophe(prevIsLetter bool, next rune) bool {
      // prevIsLetter && next is a letter
    }
checkpoint: Contractions stay whole while stray apostrophes still break words. Commit and stop here.
---

English is full of **contractions** - `don't`, `it's`, `we'll` - and a tokenizer
that split them at the apostrophe would flag `don` and a lone `t` as misspellings
on every page. So the apostrophe gets one special rule: it stays inside a word,
but *only* when it is genuinely internal - a letter before it and a letter after
it.

That guard is what keeps the rule honest. A trailing apostrophe in `James'` has no
letter after it, so it ends the word and is dropped, giving `James`. A leading
quote has no letter before it, so it never starts a word. This is a small
refinement of the letter-run scan from before: letters always continue a word, an
apostrophe continues it conditionally, everything else breaks it.
