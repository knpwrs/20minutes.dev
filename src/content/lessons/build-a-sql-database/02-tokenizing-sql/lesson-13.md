---
project: build-a-sql-database
lesson: 13
title: 'Demo: tokenizing a whole statement'
overview: Today the tokenizer becomes whole - it skips whitespace, chains every rule you wrote, and ends the stream with an explicit end-of-input token that the parser will rely on.
goal: Tokenize a complete statement into a token list that skips whitespace and ends with an EOF token.
spec:
  scenario: Tokenizing a full SQL statement
  status: failing
  lines:
    - kw: Given
      text: 'the input "SELECT * FROM users;"'
    - kw: When
      text: it is tokenized into a list
    - kw: Then
      text: 'the tokens are Keyword(SELECT), Star, Keyword(FROM), Identifier(users), Semicolon, EOF'
    - kw: And
      text: 'extra spaces and tabs between tokens produce no tokens of their own'
code:
  lang: go
  source: |
    func Tokenize(input string) ([]Token, error) {
      // loop: skip whitespace; if at end, append EOF and return
      // otherwise dispatch on the next char to the right rule
    }
checkpoint: The tokenizer turns any statement into a clean token list ending in EOF. Commit and stop here.
---

Today the individual rules become one **tokenizer loop**: skip any run of
whitespace, look at the next character, and dispatch to the rule that handles it
- letter to the word reader, digit to the number reader, quote to the string
reader, symbol to the punctuation reader. Whitespace exists only to separate
tokens, so it never becomes a token itself.

The finishing touch is the **EOF token**. Rather than making the parser
constantly ask "are there more tokens?", the tokenizer appends a single
end-of-input token so the parser can treat "end of statement" as just another
token to match. That one convention makes the recursive-descent parser you start
next chapter markedly simpler.
