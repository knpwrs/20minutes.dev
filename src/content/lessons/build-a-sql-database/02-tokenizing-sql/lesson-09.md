---
project: build-a-sql-database
lesson: 9
title: Keywords and identifiers
overview: SQL text is just characters until you group them into tokens. Today you start the tokenizer by recognizing words - and telling a keyword like SELECT apart from a table name like users.
goal: Split a run of letters into a token, and classify it as a keyword or an identifier, case-insensitively for keywords.
spec:
  scenario: Tokenizing words into keywords and identifiers
  status: failing
  lines:
    - kw: Given
      text: 'the input "SELECT name"'
    - kw: When
      text: it is tokenized
    - kw: Then
      text: 'the tokens are Keyword("SELECT") and Identifier("name")'
    - kw: And
      text: 'the input "select" also produces the keyword SELECT (case-insensitive)'
    - kw: And
      text: '"users" produces an Identifier because it is not a keyword'
    - kw: And
      text: '"user_id" is a single Identifier (underscores are part of a name)'
code:
  lang: go
  source: |
    var keywords = map[string]bool{"SELECT": true, "FROM": true /* ... */}
    // a word starts with a letter, then letters/digits/underscore:
    //   read while isLetter(c) || isDigit(c) || c == '_'
    //   if keywords[strings.ToUpper(word)] -> Keyword (store upper-cased)
    //   else -> Identifier (store as written)
checkpoint: The tokenizer recognizes words and separates keywords from identifiers. Commit and stop here.
---

A parser never works on raw characters; it works on **tokens** - the words,
numbers, and symbols of the language. The tokenizer (or *lexer*) is the first
stage, and the first thing it must do is read a run of word characters and decide
what kind of word it is. A word starts with a letter and then runs on through
letters, digits, and underscores - so `user_id` and `orders2` are each a single
identifier, which matters the moment real column names like `user_id` show up.

The distinction that matters is **keyword versus identifier**. `SELECT` and
`FROM` are reserved words with fixed meaning; `users` and `name` are names *you*
chose. SQL keywords are case-insensitive - `select`, `SELECT`, and `Select` are
the same word - so match them by upper-casing before checking your keyword set,
while preserving identifiers exactly as written. Start your keyword set small;
you will add to it as the parser grows.
