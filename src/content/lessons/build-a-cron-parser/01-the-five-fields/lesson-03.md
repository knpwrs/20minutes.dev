---
project: build-a-cron-parser
lesson: 3
title: Assembling a parsed expression
overview: Now the two halves meet - split a line into five fields, parse each into its set of allowed values, and store the result in one Expr. This is the parsed representation every later lesson reads from, so you give it its full shape today.
goal: Parse a whole expression into an Expr holding five value sets plus two day-restriction flags.
spec:
  scenario: A full expression parses into five sets
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''5 0 1 1 0'''
    - kw: When
      text: 'Parse is called on it'
    - kw: Then
      text: 'the Expr has Minute {5}, Hour {0}, Dom {1}, Month {1}, Dow {0}'
    - kw: And
      text: 'DomRestricted and DowRestricted are both true, because neither day field was ''*'''
code:
  lang: go
  source: |
    type Expr struct {
      Minute, Hour, Dom, Month, Dow map[int]bool
      DomRestricted, DowRestricted  bool // set later when matching days
    }
    // Parse: SplitFields, then parseField for each of the five specs.
    // Record DomRestricted = (dom text != "*"), same for dow.
checkpoint: Parse turns a five-field line into an Expr of five value sets. Commit and stop here.
---

An **Expr** is the compiled form of a cron line: five sets of allowed values, one
per field. `Parse` is the front door of the whole library - it calls `SplitFields`
to get the five strings, runs each through `parseField` with its `FieldSpec`, and
drops the resulting sets into the struct. Any field error bubbles up so a bad line
never produces a half-built `Expr`.

Give the struct its whole shape now, even the two fields you will not use for a
while: **DomRestricted** and **DowRestricted**. A day field is "restricted" when it
is anything other than `*` - a real constraint on which days fire. Recording that
here, on the lesson where fields first come together, means the tricky
day-of-month / day-of-week matching rule later has the flags it needs without
reshaping `Expr`. For now every field is a single number, so both flags are true.
