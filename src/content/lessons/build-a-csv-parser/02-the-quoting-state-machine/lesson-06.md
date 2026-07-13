---
project: build-a-csv-parser
lesson: 6
title: The doubled-quote escape
overview: If a quoted field can contain any character, it needs a way to contain a quote itself. CSV uses a doubled quote for that, and today you decode it, the last piece that makes quoted fields able to hold literally anything.
goal: Decode a doubled double-quote inside a quoted field into a single literal quote.
spec:
  scenario: An escaped quote inside a quoted field
  status: failing
  lines:
    - kw: Given
      text: 'the quoted input he said ""hi"" with the whole thing wrapped in quotes, that is the raw characters quote h e space s a i d space quote quote h i quote quote quote'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the one field is he said "hi" with single quotes around hi'
    - kw: And
      text: 'a quoted empty field is just two quotes, so parsing a comma "" comma (the raw characters a comma quote quote comma c) gives ["a", "", "c"]'
code:
  lang: go
  source: |
    // in QUOTED mode, on a '"' look at the NEXT rune to disambiguate:
    //   if the next rune is also '"' -> it is an escaped quote:
    //       append one '"' and consume both
    //   otherwise -> this '"' is the CLOSING quote of the field
    // an empty quoted field ("" then a delimiter) closes immediately -> ""
checkpoint: A quoted field can contain a literal double quote via the doubled-quote escape. Commit and stop here.
---

A quoted field can hold the delimiter and a newline, but it still needs to hold the
one character that has special meaning inside it: the double quote. CSV's answer is
elegant and needs no backslashes. Inside a quoted field, **two double quotes in a
row** mean one literal double quote. So `""hi""` inside quotes decodes to `"hi"`,
and the field `he said ""hi""` becomes `he said "hi"`. This doubled-quote rule is
the only escape mechanism in CSV, which is part of why the format is so simple to
write and so easy to get subtly wrong.

Decoding it is a one-rune lookahead inside your quoted state. When you are in a
quoted field and you see a double quote, peek at the character after it. If that is
also a double quote, the pair is an escaped quote: append a single quote to the
field and skip past both. If it is anything else, this quote is the real closing
quote of the field. That single decision handles every case, including the smallest
one: a field written as just two quotes with nothing between them is a quoted empty
field, which decodes to the empty string, indistinguishable in value from an absent
field like the middle of `a,,c`.
