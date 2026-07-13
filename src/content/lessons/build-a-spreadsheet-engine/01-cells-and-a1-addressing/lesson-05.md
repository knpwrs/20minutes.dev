---
project: build-a-spreadsheet-engine
lesson: 5
title: The cell value
overview: A cell can hold different kinds of data - a number, some text, a boolean, or nothing at all - and later, an error. Today you build the one tagged value type that represents any cell's result, with every kind it will ever need, and teach it to render itself as a string.
goal: Define a value type carrying a kind tag plus payload, and give it a String() that renders each kind for display.
spec:
  scenario: A value knows its kind and renders itself
  status: failing
  lines:
    - kw: Given
      text: 'the value kinds Empty, Number, Text, Bool, and Error'
    - kw: When
      text: 'values are constructed and rendered with String()'
    - kw: Then
      text: 'a Number value built from 42 reports kind Number, holds 42, and its String() is "42"; an Empty value reports kind Empty and String() is the empty string'
    - kw: And
      text: 'a Bool true has String() "TRUE" and a Bool false has String() "FALSE", while a Text "hi" reports kind Text and String() "hi"'
code:
  lang: go
  source: |
    type Kind int
    const (
      Empty Kind = iota
      Number
      Text
      Bool
      Err // used later for #DIV/0!, #CIRC!, ...
    )
    type Value struct {
      Kind Kind
      Num  float64
      Str  string
      B    bool
      Code string // the error code, when Kind == Err
    }
    // String(): "" for Empty, the number for Number (no trailing zeros),
    // the text for Text, "TRUE"/"FALSE" for Bool, the Code for Err.
checkpoint: You have a single value type covering every kind a cell can hold, and it renders itself. Commit and stop here.
---

Every cell eventually produces a **value**, and a spreadsheet's values are not all
the same type: `A1` might be the number `42`, `B1` the text `"total"`, `C1` the
boolean `TRUE`, and `D1` empty. Rather than juggle separate types, we use one
**tagged union**: a struct with a `Kind` tag and a field for each possible payload.
The tag says which field is meaningful. Define the whole set of kinds now, even the
ones we cannot produce yet - `Err` is here so that when error values like `#DIV/0!`
and `#CIRC!` arrive in a later chapter, the value type already has a home for them.

Give the value a `String()` that renders each kind the way it should appear in a
cell: an `Empty` shows as nothing, a `Number` as its digits (`42`, not `42.0`), a
`Bool` as `TRUE` or `FALSE`, a `Text` as itself, and an `Err` (later) as its code.
This display method is the other half of the value type - the sheet and, eventually,
a demo that prints the grid all lean on it. Front-loading the full kind set plus a
renderer means no later lesson has to reshape this type; every evaluator, function,
and error path just fills in the field its kind uses and gets a printable result for
free.
