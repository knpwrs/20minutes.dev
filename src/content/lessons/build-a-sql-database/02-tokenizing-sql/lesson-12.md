---
project: build-a-sql-database
lesson: 12
title: Punctuation and operators
overview: SQL is glued together with symbols - commas, parentheses, stars, and comparison operators. Today you tokenize these, including the two-character operators that must not be split.
goal: Tokenize single-character punctuation and the multi-character comparison operators as distinct tokens.
spec:
  scenario: Tokenizing punctuation and comparison operators
  status: failing
  lines:
    - kw: Given
      text: 'the input "*, ( ) <= <>"'
    - kw: When
      text: it is tokenized
    - kw: Then
      text: 'the tokens are Star, Comma, LParen, RParen, LessEqual, NotEqual'
    - kw: And
      text: '"<" alone tokenizes as LessThan and "=" as Equal'
code:
  lang: go
  source: |
    // single-char: * , ( ) = < >
    // but on '<' or '>', peek the next char first:
    //   "<=" ">=" "<>" are one token each; otherwise it is the single char
checkpoint: The tokenizer handles punctuation and both single- and two-character operators. Commit and stop here.
---

Beyond words and literals, SQL is held together by **symbols**: the `*` in
`SELECT *`, the commas between columns, the parentheses around a value list, and
the comparison operators in a `WHERE` clause. Most are a single character and map
straight to a token kind.

The wrinkle is the **two-character operators** - `<=`, `>=`, and `<>` (not
equal). When the tokenizer sees `<`, it must peek at the next character to decide
whether it is looking at `<`, `<=`, or `<>` before committing. Get this
"maximal munch" right and `age <= 30` tokenizes as three tokens, not four. This
is the same lookahead you will lean on again wherever one character can begin
several different tokens.
