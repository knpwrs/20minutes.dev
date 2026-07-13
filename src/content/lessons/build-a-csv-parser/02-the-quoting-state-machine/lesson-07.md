---
project: build-a-csv-parser
lesson: 7
title: A quote is only special at the start
overview: A double quote only opens a quoted field when it is the very first character of that field. Anywhere else it is an ordinary character, and today you pin that rule so a stray quote in the middle of a value does not derail the parser.
goal: Treat a double quote that is not at the start of a field as a literal character.
spec:
  scenario: A literal quote inside an unquoted field
  status: failing
  lines:
    - kw: Given
      text: 'the input a"b (the raw characters a quote b, with no surrounding quotes)'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the one field is a"b, with the quote kept as a literal character'
    - kw: And
      text: 'a quote after other characters never opens a quoted field, so ab"c,d gives ["ab\"c", "d"]; the doubled-quote escape applies only inside quotes, so the unquoted field a""b stays literal as a""b; and the decision is per field, so a,"b,c" still opens a quoted second field, giving ["a", "b,c"]'
code:
  lang: go
  source: |
    // decide quoted-vs-unquoted ONCE, when the field is still empty:
    //   if the first rune of the field is '"' -> quoted mode (lesson 4)
    //   otherwise the field is unquoted for its whole length
    // in unquoted mode a '"' is just another rune: append it, no special meaning
checkpoint: A double quote is only special as the first character of a field; elsewhere it is literal. Commit and stop here.
---

Quoting in CSV is all-or-nothing per field, and the decision is made at the field's
first character. If a field begins with a double quote, it is a quoted field and the
quote rules apply. If it begins with anything else, it is an **unquoted** field, and
from then on a double quote inside it is simply a literal character with no power to
start a quoted region. So `a"b` is a three-character value, quote and all, and there
is nothing malformed about it.

This rule is what keeps the state machine unambiguous. Without it, a quote appearing
after some text would be a puzzle, is it opening a new quoted region mid-field or
not? By fixing the quoted-or-not decision at the start of each field, you never have
to ask. The practical consequence is that data containing stray quotes, common in
scraped or hand-edited files, passes through unquoted fields untouched rather than
throwing an error. Note the flip side, coming next: a field that *does* open with a
quote has now made a promise to close it, and breaking that promise is the first
real error your parser will report.
