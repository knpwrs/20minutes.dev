---
project: build-a-spreadsheet-engine
lesson: 7
title: Literals versus formulas
overview: A cell's raw input is either a plain literal or a formula. The one rule that separates them is a leading equals sign. Today you classify a cell's input so the engine knows which cells it will have to compute later.
goal: Classify a cell's string input as a number, text, or boolean literal, or as a formula when it starts with "=".
spec:
  scenario: Input is classified as literal or formula
  status: failing
  lines:
    - kw: Given
      text: 'a cell set from a raw string with SetCell'
    - kw: When
      text: 'the input is classified'
    - kw: Then
      text: 'SetCell("A1", "5") gives Get("A1") the Number 5 with IsFormula("A1") false, and SetCell("A2", "hi") gives the Text "hi"'
    - kw: And
      text: 'SetCell("A3", "TRUE") gives the Bool true, and SetCell("A4", "=A1+1") sets IsFormula("A4") true with Formula("A4") equal to "=A1+1" (its value stays Empty until evaluated)'
code:
  lang: go
  source: |
    // a cell now remembers its raw text and whether it is a formula
    func (s *Sheet) SetCell(a, in string) {
      if strings.HasPrefix(in, "=") {
        // store raw text; mark formula; value is Empty for now
        return
      }
      if n, err := strconv.ParseFloat(in, 64); err == nil { /* Number */ }
      // "TRUE"/"FALSE" -> Bool; otherwise Text
    }
checkpoint: The sheet can tell a literal cell from a formula cell. Commit and stop here.
---

A real spreadsheet does not ask which kind of thing you are typing - it infers it.
Type `5` and you get a number; type `hello` and you get text; type `=A1+1` and you
get a **formula**. The single rule that separates a formula from a literal is the
leading `=`. Everything else is a literal, and we classify literals by trying the
most specific interpretation first: does it parse as a number? is it exactly `TRUE`
or `FALSE`? otherwise it is text.

The important design choice today is that a formula cell **stores its raw text** and
is *marked* as a formula, but does not compute a value yet - its value stays
`Empty`. We have no parser or evaluator, so there is nothing to compute with. What
matters is that the sheet can now answer "is this cell a formula, and if so what is
its text" - the two questions the whole calculation engine is built to answer. The
next chapter turns that stored formula text into something we can evaluate.
