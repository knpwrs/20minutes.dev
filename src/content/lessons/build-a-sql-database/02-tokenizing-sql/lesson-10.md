---
project: build-a-sql-database
lesson: 10
title: Number literals
overview: Queries are full of numbers - ages, ids, totals. Today you teach the tokenizer to read a run of digits into a single number token carrying its integer value.
goal: Recognize a run of digits as one number token and attach its integer value.
spec:
  scenario: Tokenizing integer literals
  status: failing
  lines:
    - kw: Given
      text: 'the input "42 0"'
    - kw: When
      text: it is tokenized
    - kw: Then
      text: 'the tokens are Number(42) and Number(0)'
    - kw: And
      text: 'the input "100" produces Number(100)'
code:
  lang: go
  source: |
    // read digits while unicode.IsDigit(c)
    // convert the collected text to an int64 for the token's value
    tok := Token{Kind: TokNumber, Int: parsed}
checkpoint: The tokenizer reads integer literals and carries their numeric value. Commit and stop here.
---

A **number literal** is a run of digit characters that stands for an integer
value. The tokenizer reads consecutive digits, stops at the first non-digit, and
converts the collected text into an actual number stored on the token - so later
stages get `42` the integer, not `"42"` the string.

Keeping the parsed value *on the token* is the point: the parser and executor
should never re-parse text. For now integers are all you need - decimals and
negatives can wait, and negatives will fall out naturally later as an operator
applied to a positive literal.
