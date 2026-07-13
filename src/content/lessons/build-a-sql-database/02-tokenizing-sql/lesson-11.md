---
project: build-a-sql-database
lesson: 11
title: String literals
overview: Text values in SQL are wrapped in single quotes. Today you teach the tokenizer to read a quoted string into a token holding just the text between the quotes.
goal: Recognize a single-quoted run of characters as one string token, holding the text without the quotes.
spec:
  scenario: Tokenizing single-quoted string literals
  status: failing
  lines:
    - kw: Given
      text: "the input 'alice'"
    - kw: When
      text: it is tokenized
    - kw: Then
      text: 'the single token is String("alice")'
    - kw: And
      text: "the input '' produces String(\"\") - an empty string"
    - kw: And
      text: an unterminated quote reports an error
code:
  lang: go
  source: |
    // saw a single quote: consume chars until the closing quote
    // the token text is everything strictly between the quotes
    // hitting end-of-input before the closing quote is an error
checkpoint: The tokenizer reads single-quoted string literals, including the empty string. Commit and stop here.
---

In SQL, **text literals** are wrapped in single quotes: `'alice'`. The tokenizer
sees the opening quote, then consumes every character up to the closing quote,
and the token's text is what lies *between* them - the quotes are syntax, not
data. The empty string `''` is a real, common value and must tokenize to a
string token whose text is empty.

One boundary matters: a quote that is never closed - `'alice` - is a syntax
error, not a token. Reaching the end of the input while still inside a string
should report a clear "unterminated string" rather than silently swallowing the
rest of the query. Doubled-quote escaping (`'it''s'`) is a refinement you can add
later; a straight run to the closing quote is enough today.
