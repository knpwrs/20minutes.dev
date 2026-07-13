---
project: build-a-spell-checker
lesson: 21
title: Learning frequencies from text
overview: Real frequency counts come from reading a lot of text. Today you train the dictionary from a body of prose, tokenizing it and counting every word, so a big corpus becomes a language model in one call.
goal: Build word counts by tokenizing a passage of text and adding every word it contains.
spec:
  scenario: Counting words across a passage
  status: failing
  lines:
    - kw: Given
      text: an empty dictionary
    - kw: When
      text: 'TrainFrom("the cat sat the cat the") is called'
    - kw: Then
      text: 'Count("the") is 3, Count("cat") is 2, and Count("sat") is 1'
    - kw: And
      text: 'Size() is 3'
code:
  lang: go
  source: |
    func (d *Dictionary) TrainFrom(text string) {
      // tokenize the text and Add each word - the tokenizer and
      // Add already normalize, so counts accumulate correctly
      for _, tok := range Tokenize(text) {
        d.Add(tok.Text)
      }
    }
checkpoint: The dictionary learns word frequencies from a passage of text. Commit and stop here.
---

A hand-built count map is fine for a test, but a real language model is **learned
from a corpus** - a large body of text where common words naturally appear often.
`TrainFrom` is how that corpus gets in: tokenize the passage and add every word,
letting the counts pile up. Reading `the cat sat the cat the` leaves `the` at 3,
`cat` at 2, `sat` at 1 - a miniature frequency model.

This reuses the whole front of the project - the tokenizer finds the words, `Add`
normalizes and counts them - and it is exactly how the finished tool is seeded:
point it at a big text file (a book, a pile of articles) and it learns both the
vocabulary (which words exist) and the frequencies (how common each is) in one
pass. Both halves matter: membership decides *whether* to flag a word, frequency
decides *which* correction to prefer.
