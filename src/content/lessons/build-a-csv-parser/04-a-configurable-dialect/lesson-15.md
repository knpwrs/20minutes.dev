---
project: build-a-csv-parser
lesson: 15
title: Optional space trimming
overview: Sometimes the spaces people add after a comma really are noise, so a dialect can ask for them to be trimmed. Today you add an opt-in trim that strips surrounding spaces from unquoted fields while leaving quoted content untouched.
goal: Add a dialect option that trims leading and trailing spaces from unquoted fields only.
spec:
  scenario: Trimming unquoted fields
  status: failing
  lines:
    - kw: Given
      text: 'a dialect with trimming enabled, and the input with spaces around each field, space a space comma space b space'
    - kw: When
      text: 'it is parsed with that dialect'
    - kw: Then
      text: 'the surrounding spaces are removed, giving ["a", "b"]'
    - kw: And
      text: 'trimming never touches a quoted field, so with trimming on the quoted input quote space x space quote parses to one field " x " with its spaces intact, and the default dialect does not trim at all'
code:
  lang: go
  source: |
    // add a bool to the dialect: type Dialect struct { Delimiter rune; Trim bool }
    // when Trim is set, strip leading/trailing spaces from an UNQUOTED field's value
    // a QUOTED field is never trimmed: decide by remembering whether THIS field opened
    //   with a quote, and skip the trim for it
checkpoint: An opt-in dialect trim strips spaces from unquoted fields but leaves quoted ones alone. Commit and stop here.
---

The previous chapter made spaces significant, which is the safe default, but it is
not always what you want. A file where every value was written with a cosmetic space
after the comma is tidier to consume if those spaces come off. So the dialect grows a
**trim** flag: when it is on, an unquoted field has its leading and trailing spaces
removed before it goes into the record. When it is off, which is the default,
nothing changes and spaces stay put.

The important boundary is that trimming applies only to **unquoted** fields. A quoted
field's whole purpose is to preserve its content exactly, so spaces a user
deliberately put inside quotes must survive even with trimming on. That means the
trim decision depends on whether the field opened with a quote, the same bit of state
your machine already tracks, so remember it per field and skip the trim for quoted
ones. This keeps two promises at once: quoting is exact, and trimming is a convenience
that only ever affects the unprotected, unquoted values where stray spaces are most
likely accidental.
