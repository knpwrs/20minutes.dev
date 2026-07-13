---
project: build-a-spreadsheet-engine
lesson: 8
title: Tokenizing numbers and operators
overview: Before a formula can be parsed it has to be broken into tokens - the atoms a parser reads. Today you build the tokenizer's core, stripping the leading equals sign and scanning numbers, arithmetic operators, and parentheses, with the full token set defined up front.
goal: Tokenize a formula's numbers, arithmetic operators, and parentheses into a token stream.
spec:
  scenario: A formula scans into arithmetic tokens
  status: failing
  lines:
    - kw: Given
      text: 'the formula string ''=1+2*3'''
    - kw: When
      text: 'tokenize strips the leading ''='' and scans the rest'
    - kw: Then
      text: 'it yields the tokens Number 1, Plus, Number 2, Star, Number 3, then EOF'
    - kw: And
      text: 'tokenize(''=12+3'') yields Number 12, Plus, Number 3, EOF, reading the multi-digit number as one token'
code:
  lang: go
  source: |
    type TokKind int
    const ( // the full token set the parser will ever see
      TNum TokKind = iota
      TPlus; TMinus; TStar; TSlash; TLParen; TRParen
      TCell; TColon; TComma; TIdent
      TGt; TLt; TGe; TLe; TEq; TNe
      TEOF
    )
    // scan a run of digits as one Number; single chars for + - * / ( )
checkpoint: A formula scans into a stream of number and operator tokens ending in EOF. Commit and stop here.
---

Parsing happens in two stages, and the first is **tokenizing** (also called
lexing): turning the raw formula string into a flat list of meaningful atoms. The
parser never looks at characters - it reads tokens like "the number 12", "a plus",
"an open paren". A key detail is that a number is *one* token even when it spans
several digits, so `12` scans as a single `Number 12`, not two separate digits.

Two setup decisions pay off later. First, a formula always begins with `=`, so the
tokenizer strips that leading sign before scanning - by the time the parser runs,
the `=` is gone. Second, define the **entire** token set now, including kinds we
cannot produce yet (cell references, colons, commas, comparison operators). Naming
them all up front means the parser's later lessons only add scanning rules, never
reshape the token type. End every stream with an explicit `EOF` token so the parser
always knows when input has run out.
