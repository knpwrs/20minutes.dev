---
project: build-a-spell-checker
lesson: 4
title: Tokenizing text into words
overview: Real input is not a tidy list of words - it is prose with punctuation and spaces. Today you build the tokenizer that splits a run of text into the words a checker can actually look up.
goal: Split a string of text into its words, discarding punctuation and whitespace.
spec:
  scenario: Breaking punctuated text into words
  status: failing
  lines:
    - kw: Given
      text: 'the text "Hello, world! Nice day."'
    - kw: When
      text: it is tokenized
    - kw: Then
      text: 'the words are exactly ["Hello", "world", "Nice", "day"]'
    - kw: And
      text: 'tokenizing "" returns an empty list'
code:
  lang: go
  source: |
    // a "word" is a maximal run of letters; everything else
    // (spaces, commas, periods, digits) is a separator
    func Tokenize(text string) []string {
      // walk the runes, collect runs of letters, flush on a non-letter
    }
checkpoint: You can turn a line of prose into its list of words. Commit and stop here.
---

A checker never sees clean words - it sees sentences. Before you can ask "is this
a word?", you have to *find* the words inside `Hello, world!`. That job is
**tokenization**: scan the text and cut it into tokens, where a word is a maximal
run of letters and every other character - space, comma, period - is a boundary
that ends the current word.

Keep the rule crisp: a token is a run of **letters**, nothing else. Punctuation is
dropped, not attached, so `world!` yields `world` and the trailing `!` simply ends
the token. An empty string yields no words at all. This is the plainest useful
tokenizer; the next lessons refine it to remember *where* each word was and to
keep apostrophes inside contractions.
