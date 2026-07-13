---
project: build-a-spell-checker
lesson: 33
title: The checker and its issues
overview: The tool needs a stable public face. Today you introduce the Checker that wraps a dictionary and reports each problem as an Issue - a word, where it is, and its suggestions - the report structure the rest of the chapter fills in.
goal: Build a Checker whose Check returns one Issue per unknown word, carrying the word, its offset, and a suggestion.
spec:
  scenario: Reporting unknown words as issues
  status: failing
  lines:
    - kw: Given
      text: 'a Checker over a dictionary containing "the" and "cat"'
    - kw: When
      text: 'Check("teh cat") is called'
    - kw: Then
      text: 'it returns one Issue: Word "teh", Start 0, Suggestions ["the"]'
    - kw: And
      text: '"cat" produces no Issue, because it is a known word'
code:
  lang: go
  source: |
    type Issue struct {
      Word        string
      Start       int
      Suggestions []string // filled richer over the next lessons
    }
    type Checker struct { dict *Dictionary }
    func NewChecker(d *Dictionary) *Checker { /* ... */ }
    func (c *Checker) Check(text string) []Issue {
      // for each unknown token: Issue{word, start, [CorrectFast(word)]}
    }
checkpoint: The Checker reports unknown words as structured Issues. Commit and stop here.
---

The engine is done; now it becomes a **tool**. A tool needs a clean public surface,
so you wrap the dictionary in a `Checker` and give it one output type: the
**`Issue`**. Each `Issue` names an unknown word, where it sits in the text, and the
suggestions for it. Today the suggestions are just the single best correction, but
the struct is deliberately shaped for more - a *list* of suggestions, room for a
line and column - because the rest of the chapter thickens exactly this record.

Front-loading the full `Issue` shape now means every later feature slots in without
reshaping what came before: top-N suggestions fill the list, case-matching rewrites
the strings, line and column add fields, the formatter reads them. This is the same
move that started the project - define the report unit once, up front, and grow it
in place rather than bolting fields on in a panic later.
