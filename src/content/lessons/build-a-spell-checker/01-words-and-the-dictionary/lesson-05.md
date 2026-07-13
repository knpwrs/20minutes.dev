---
project: build-a-spell-checker
lesson: 5
title: Where each word sits
overview: To tell a user "the misspelling is at position 12", the tokenizer has to remember where each word started. Today you attach a byte offset to every token so later lessons can point at problems in the text.
goal: Have the tokenizer return each word together with the offset where it begins.
spec:
  scenario: Tracking the start offset of each word
  status: failing
  lines:
    - kw: Given
      text: 'the text "cat dog"'
    - kw: When
      text: it is tokenized with positions
    - kw: Then
      text: 'the tokens are {text:"cat", start:0} and {text:"dog", start:4}'
    - kw: And
      text: 'for "  hi", the single token is {text:"hi", start:2}'
code:
  lang: go
  source: |
    type Token struct {
      Text  string
      Start int // byte offset of the first letter
    }
    func Tokenize(text string) []Token {
      // remember the index where each run of letters BEGINS,
      // and record it when you flush the token
    }
checkpoint: Every token now carries the offset where its word begins. Commit and stop here.
---

A spell checker is only useful if it can point at the problem: "unknown word at
column 12". That means a token can no longer be just a string - it has to remember
**where it came from**. Today the tokenizer returns a small `Token` value pairing
the word with the **byte offset** of its first letter in the original text.

The change is small but load-bearing. When you start a new run of letters, note
the index you started at; when you flush the token, stamp that index onto it. Two
spaces before `hi` push its start to `2`, and `dog` in `cat dog` starts at `4`
because `cat` plus the space took the first four bytes. Every "point at the error"
feature later - column numbers, reports, highlighting - reads this offset.
