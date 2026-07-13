---
project: build-a-spell-checker
lesson: 7
title: Flagging unknown words
overview: This is the first thing worth calling a spell checker - it reads text and points at every word not in the dictionary. Today you compose the tokenizer and the membership test into a Check that returns the unknown words with their positions.
goal: Return every token in a text whose word is not in the dictionary, each with its offset.
spec:
  scenario: Reporting the unknown words in a line of text
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary containing "cat" and "dog"'
    - kw: When
      text: 'Check("cat xyz dog") is called'
    - kw: Then
      text: 'it returns exactly one token: {text:"xyz", start:4}'
    - kw: And
      text: 'Check("Cat DOG") returns no tokens, because membership ignores case'
code:
  lang: go
  source: |
    func (d *Dictionary) Check(text string) []Token {
      // tokenize with positions, keep the tokens whose word
      // is NOT Contains(...) - those are the flagged words
    }
checkpoint: The checker flags unknown words in a line of text, with positions. Commit and stop here.
---

Everything so far snaps together here. `Check` **tokenizes** the input into
positioned words, then keeps only the ones the dictionary does not **contain** -
those are the suspected misspellings. That is a genuine, usable spell checker,
even though it cannot yet suggest a fix: give it text and it tells you which words
it does not recognize and exactly where they are.

Notice how the earlier decisions pay off. Case folding means `Cat` and `DOG` match
their lower-case dictionary entries and are not flagged, while the offset on each
token means a flagged word arrives with the column you would underline. The rest
of the project answers the natural follow-up question - not just "is this wrong?"
but "what did you probably mean?"
