---
project: build-a-programming-language
lesson: 8
title: Tokenizing a whole program
overview: Your lexer now knows every token kind the language uses. Today you point it at a realistic line of source and wire it into the REPL, so typing code prints the exact token stream - the first end-to-end run of the pipeline.
goal: Lex a full statement into its complete token stream and have the REPL print those tokens.
spec:
  scenario: Lexing a realistic statement
  status: failing
  lines:
    - kw: Given
      text: 'the source line: let add = fn(x, y) { x + y };'
    - kw: When
      text: 'the lexer produces tokens until the end'
    - kw: Then
      text: 'the token types are LET, IDENT, ASSIGN, FUNCTION, LPAREN, IDENT, COMMA, IDENT, RPAREN, LBRACE, IDENT, PLUS, IDENT, RBRACE, SEMICOLON, EOF'
    - kw: And
      text: 'entering that line at the REPL prints one token per line'
code:
  lang: go
  source: |
    // in the REPL loop, replace the echo with a lexer pass
    lex := NewLexer(line)
    for tok := lex.NextToken(); tok.Type != EOF; tok = lex.NextToken() {
      fmt.Printf("{Type:%s Literal:%s}\n", tok.Type, tok.Literal)
    }
checkpoint: The REPL tokenizes whatever you type and prints the token stream - the lexer is complete. Commit and stop for today.
---

This is the first time the whole front of the pipeline runs together. The line
`let add = fn(x, y) { x + y };` exercises nearly everything you built:
keywords (`let`, `fn`), identifiers, an assignment, delimiters, a binary
operator, and the terminating semicolon. If the token stream comes out exactly as
specified, your lexer is done.

Wiring it into the REPL turns that loop from an echo into a real tool: type a
line, watch it decompose into tokens. Keep this token-printing mode around - it
is the quickest way to see what the lexer thinks of any input, and it closes out
the tokenizing chapter with something you can actually run.
