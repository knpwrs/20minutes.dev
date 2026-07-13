---
project: build-a-programming-language
lesson: 5
title: Identifiers and keywords
overview: Names and keywords look the same to the lexer at first - both are runs of letters. Today you read those runs, then use a lookup table to decide whether a word is a reserved keyword like let or an ordinary identifier.
goal: Read letter-runs as identifiers, promoting reserved words to their own keyword token types.
spec:
  scenario: Distinguishing keywords from identifiers
  status: failing
  lines:
    - kw: Given
      text: 'the source string "let five"'
    - kw: When
      text: 'the lexer produces tokens until the end'
    - kw: Then
      text: 'the tokens are LET "let", IDENT "five", EOF'
    - kw: And
      text: 'the words fn, true, false, if, else, return, and while each lex to their own keyword token type, while any other word is an IDENT'
code:
  lang: go
  source: |
    var keywords = map[string]string{
      "let": LET, "fn": FUNCTION, "true": TRUE, "false": FALSE,
      "if": IF, "else": ELSE, "return": RETURN, "while": WHILE,
    }
    func lookupIdent(word string) string {
      if t, ok := keywords[word]; ok { return t }
      return IDENT
    }
checkpoint: The lexer reads words and classifies each as a keyword or an identifier. Commit.
---

An **identifier** is a name the programmer chose - `five`, `add`, `x`. A
**keyword** is a name the language reserves - `let`, `fn`, `if`. The lexer reads
both the same way: gather a run of letters using the read-while-it-matches loop
you built for numbers. The only new step is what happens *after* you have the
word.

Once you have the whole word, look it up in a small keyword table. If it is
there, the token gets that keyword's type; if not, it is a plain `IDENT` carrying
the name. Define the full keyword set now - `let fn true false if else return
while` - even though you have not built the features they name yet, so the lexer
never has to change as the language grows.
