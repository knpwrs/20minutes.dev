---
project: build-a-spreadsheet-engine
lesson: 9
title: Tokenizing references, names, and comparisons
overview: Formulas contain more than arithmetic - cell references, ranges, function names, argument commas, and comparisons. Today you finish the tokenizer by scanning all of those, so the parser has every atom it needs.
goal: Tokenize cell references, colons, identifiers, commas, and comparison operators.
spec:
  scenario: The tokenizer scans references, names, and comparisons
  status: failing
  lines:
    - kw: Given
      text: 'the formula ''=SUM(A1:B3, 2)'''
    - kw: When
      text: 'tokenize scans it'
    - kw: Then
      text: 'it yields Ident SUM, LParen, Cell A1, Colon, Cell B3, Comma, Number 2, RParen, EOF'
    - kw: And
      text: 'tokenize(''=A1>=B1'') yields Cell A1, GreaterEqual, Cell B1, EOF (the two-character ''>='' is one token, distinct from a bare ''>'')'
code:
  lang: go
  source: |
    // letters followed by digits => Cell (A1); letters alone => Ident (SUM)
    // ':' Colon, ',' Comma
    // '>' then peek: ">=" is Ge, else Gt; '<' -> "<=" Le, "<>" Ne, else Lt
    // '=' (inside a formula) is Eq
checkpoint: The tokenizer now recognizes every atom a formula can contain. Commit and stop here.
---

The rest of the token kinds are what make a spreadsheet formula more than a
calculator. A run of letters **followed by digits** is a cell reference (`A1`,
`B3`); the tokenizer emits a `Cell` token holding that text. A run of letters with
**no** trailing digits is an identifier - a function name like `SUM`. A colon joins
two references into a range, and a comma separates function arguments.

The comparison operators need a small amount of lookahead. When the scanner sees
`>`, it must peek at the next character: `>=` is a single "greater-or-equal" token,
while a lone `>` is "greater-than". Likewise `<` may begin `<=` or `<>` (not-equal)
or stand alone. And since the leading `=` of the formula was already stripped, any
`=` the scanner meets now is the **equality** operator inside the formula, like in
`=A1=B1`. With these rules the tokenizer is complete, and every following lesson is
about the parser, not the scanner.
