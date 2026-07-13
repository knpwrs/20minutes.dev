---
project: build-an-expression-evaluator
lesson: 6
title: Decimal numbers
overview: Not every number is an integer, so the scanner needs to accept a decimal point inside a number run. Today you extend number scanning to allow a dot, then confirm the tokenizer handles a full expression end to end.
goal: Extend the number rule so a decimal point is part of the number run.
spec:
  scenario: A decimal point is scanned as part of one Number token
  status: failing
  lines:
    - kw: Given
      text: 'the input "3.14 + 2"'
    - kw: When
      text: 'it is tokenized'
    - kw: Then
      text: 'the tokens are Number "3.14" at 0, Operator "+" at 5, and Number "2" at 7'
    - kw: And
      text: 'they are followed by an EOF token at position 8'
code:
  lang: go
  source: |
    // include '.' both to start a number and to continue one
    case (c >= '0' && c <= '9') || c == '.':
      j := i
      for j < len(in) && ((in[j] >= '0' && in[j] <= '9') || in[j] == '.') { j++ }
      toks = append(toks, Token{Number, in[i:j], i}); i = j
checkpoint: Numbers may contain a decimal point, and the tokenizer scans a full expression. Commit and stop here.
---

A decimal like `3.14` is still one number, so the fix is small: let the **dot** both
begin a number run and continue one, alongside the digits. The run `3.14` is scanned
as a single `Number` token whose text is `"3.14"`, and the operator that follows it
picks up at its own position. This is deliberately permissive; it will happily scan
`3.1.4` too, and leaving that to be caught later (when the text is converted to an
actual number) keeps the scanner simple and its rules independent.

With this, the tokenizer is complete for arithmetic: it turns `"3.14 + 2"` into the
clean stream `Number "3.14"`, `Operator "+"`, `Number "2"`, `EOF`. That stream, with
its kinds, texts, and positions, is the entire interface between the scanner and the
parser you start building next. Everything from here reads tokens, never characters.
