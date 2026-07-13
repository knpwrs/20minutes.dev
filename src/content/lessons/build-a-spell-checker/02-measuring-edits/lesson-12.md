---
project: build-a-spell-checker
lesson: 12
title: Suggesting for a document
overview: Time to close the chapter with something you can run - a checker that not only flags unknown words but offers the nearby real words as suggestions. Today you join Check and Nearby into a single pass over a line of text.
goal: For each unknown word in a text, report it with the dictionary words within two edits of it.
spec:
  scenario: Flagging words with their suggestions
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary containing "cat", "world", and "word"'
    - kw: When
      text: 'Suggestions("cat wrld", 2) is called'
    - kw: Then
      text: 'it returns one entry: the word "wrld" at start 4, with suggestions ["word", "world"]'
    - kw: And
      text: '"cat" produces no entry, because it is in the dictionary'
code:
  lang: go
  source: |
    type Flagged struct {
      Token       Token
      Suggestions []string
    }
    func (d *Dictionary) Suggestions(text string, max int) []Flagged {
      // Check(text) gives the unknown tokens; for each,
      // attach Nearby(token.Text, max)
    }
checkpoint: The checker now flags unknown words and suggests the nearest real ones. Commit and stop here.
---

This is the first end-to-end **spell checker** in the classic sense: feed it a
line, and for every word it does not recognize it hands back the real words you
most likely meant. It reuses everything the chapter built - `Check` to find the
unknown tokens, `Nearby` to find their closest dictionary neighbors - and threads
the token's position through so a suggestion always knows where its typo lives.

It also makes the cost obvious. Each flagged word triggers a full scan of the
dictionary, so a paragraph of typos against a real word list would be painfully
slow. That felt cost is the motivation for the next three chapters: generate
candidates directly from the typo instead of scanning, rank them by how common
each word is, and index the dictionary so lookups prune away almost everything.
The behavior stays the same - the speed is what changes.
