---
project: build-a-cron-parser
lesson: 21
title: Shortcut macros
overview: Cron accepts convenience macros like `@daily` and `@hourly` that each stand for a full five-field expression. Today Parse expands a macro to its equivalent line before parsing, so the whole grammar keeps working unchanged.
goal: Expand the shortcut macros `@hourly`, `@daily`, `@weekly`, `@monthly`, and `@yearly` to their five-field equivalents.
spec:
  scenario: A macro parses as its five-field expansion
  status: failing
  lines:
    - kw: Given
      text: 'the macro ''@daily'''
    - kw: When
      text: 'Parse is called on it'
    - kw: Then
      text: 'it produces the same Expr as ''0 0 * * *'' - Minute {0}, Hour {0}, and full day-of-month, month, and day-of-week sets'
    - kw: And
      text: '''@hourly'' equals ''0 * * * *'', ''@weekly'' equals ''0 0 * * 0'', ''@monthly'' equals ''0 0 1 * *'', and ''@yearly'' equals ''0 0 1 1 *'''
code:
  lang: go
  source: |
    var macros = map[string]string{
      "@hourly": "0 * * * *", "@daily": "0 0 * * *",
      "@weekly": "0 0 * * 0", "@monthly": "0 0 1 * *",
      "@yearly": "0 0 1 1 *",
    }
    // in Parse, before SplitFields: if the whole line is a known macro,
    // replace it with its expansion, then parse exactly as normal.
checkpoint: Parse expands the five shortcut macros to their equivalent expressions. Commit and stop here.
---

Real crontabs let you write `@daily` instead of `0 0 * * *`, because a handful of
common schedules deserve a memorable name. These **macros** are pure syntactic sugar:
each one is just an alias for an ordinary five-field line. `@hourly` fires at the top
of every hour (`0 * * * *`), `@daily` at midnight (`0 0 * * *`), `@weekly` at midnight
on Sunday (`0 0 * * 0`), `@monthly` at midnight on the first (`0 0 1 * *`), and
`@yearly` at midnight on January 1st (`0 0 1 1 *`).

The clean way to support them is expansion: at the very top of `Parse`, before you
split anything, check whether the whole line is a known macro and if so swap in its
five-field equivalent. From that point the rest of the pipeline - splitting, field
parsing, the restriction flags - runs exactly as before, so a macro compiles to an
`Expr` indistinguishable from its longhand form and every downstream feature keeps
working for free. (Two more aliases exist in the wild - `@midnight` for `@daily` and
`@annually` for `@yearly` - and slot into the same table if you want them.)
