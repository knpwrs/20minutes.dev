---
project: build-a-tts-model
lesson: 8
title: Expanding numbers to words
overview: 'A synthesizer has no idea how to pronounce the digits "20" - it can only pronounce words. Today you spell out any number from 0 to 999, then use that to expand a digit token inside a real sentence.'
goal: 'Convert any integer from 0 to 999 into its English words, then use it to expand a standalone digit token in a sentence.'
spec:
  scenario: Expanding numbers to words
  status: failing
  lines:
    - kw: Given
      text: 'the integers 0, 13, 20, 42, 100, 365 and 999'
    - kw: When
      text: each is converted to words
    - kw: Then
      text: '0 becomes "zero" and 13 becomes "thirteen" - an irregular teen, not a "ten-three" pattern'
    - kw: And
      text: '20 becomes "twenty" with no trailing part, since it divides ten exactly, while 42 becomes "forty-two" - a tens word, a hyphen, then a ones word'
    - kw: And
      text: '100 becomes "one hundred", and 365 becomes "three hundred sixty-five" - a hundreds word followed by the same tens-and-ones rule'
    - kw: And
      text: '999 becomes "nine hundred ninety-nine" - the largest value this function supports; it covers only 0 through 999'
    - kw: Given
      text: 'the normalized sentence "dr. smith has 20 cats."'
    - kw: When
      text: its standalone digit token is expanded
    - kw: Then
      text: 'the result is exactly "dr. smith has twenty cats." - only the numeral changes; the rest of the sentence and its punctuation are untouched'
code:
  lang: go
  source: |
    // 0-19 are irregular words. 20-99 is a tens word, a hyphen, then a ones
    // word - no hyphen at an exact ten. 100-999 is a ones word plus " hundred",
    // then recurse on the remainder - skip that part entirely if it is zero.
    if n < 20 {
      return ones[n]
    }
checkpoint: 'Any number in your text can now be spoken as words, and you have expanded a real sentence end to end. Commit and stop for today.'
---

A phoneme inventory has no entry for the digit "2" - only for the sounds in
the word "two". So before a sentence reaches pronunciation, every number in
it has to become the words a speaker would actually say. Zero through
nineteen are irregular and just need a table; everything else composes out
of a tens word and a ones word, joined the way "forty-two" is, rather than
misread digit by digit as "four two".

The function only needs to cover 0 to 999 - that is every number this
project's example sentences ever produce, and reaching further (thousands,
decimals, negative numbers read aloud) is a real but separate problem this
lesson deliberately leaves alone. Once `NumberToWords` exists, expanding a
sentence is just finding the token that is all digits and swapping in its
words, leaving every other word and every punctuation mark exactly as it was.
