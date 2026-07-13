---
project: build-a-json-parser
lesson: 21
title: Surfacing scanner errors, including unterminated strings
overview: The scanner already flags bad bytes as Illegal tokens; the parser must turn those into the same positioned errors as its own. Today you connect the two, with the unterminated string as the headline case.
goal: Convert an Illegal token from the scanner into a positioned ParseError.
spec:
  scenario: A scan error reaching the caller
  status: failing
  lines:
    - kw: Given
      text: 'input whose scanning fails'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse of a quote followed by a-b-c with no closing quote gives "unterminated string at line 1, column 1"'
    - kw: And
      text: 'Parse of a quote then a single backslash then end gives "unterminated string at line 1, column 1", and Parse of a quote then backslash-u-D-8-3-4 then quote gives an error whose position is line 1, column 1'
code:
  lang: go
  source: |
    // the scanner marks an unterminated string as Illegal with Msg
    // "unterminated string", positioned at the opening quote.
    // in parseValue, before anything else:
    //   if tok.Kind == Illegal {
    //     return ParseError{Msg: tok.Msg, Offset: tok.Offset,
    //                       Line: tok.Line, Col: tok.Col}
    //   }
checkpoint: Scanner errors reach the caller as positioned ParseErrors. Commit and stop here.
---

The scanner has been reporting malformed bytes as **Illegal tokens** since the
keyword lesson - a bad escape, a control character, a lone surrogate, and now an
**unterminated string** that runs into the end of input without a closing quote. But
the parser has never looked at an Illegal token, because no valid document contains
one. Today you close the loop: when `parseValue` encounters an Illegal token, it
turns it into a `ParseError` carrying the token's own message and position.

The headline case is the unterminated string. Make the scanner mark it Illegal with
the message `unterminated string`, positioned at the **opening quote** so the error
points at where the string began - the most useful place for a human hunting the
missing quote. A string that ends in a dangling backslash is unterminated for the
same reason. With this one small conversion, every scan-level failure - surrogate
errors, control characters, bad numbers - reaches the caller as the same kind of
clean, positioned error the parser produces itself.
