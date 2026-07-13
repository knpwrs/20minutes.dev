---
project: build-a-programming-language
lesson: 16
title: Let statements
overview: So far a program is just a bare expression. Today you parse your first real statement - a let binding - which means teaching the parser to dispatch on the leading token and choose between statement kinds.
goal: Parse a let binding into a statement holding the name and the value expression.
spec:
  scenario: Parsing a let binding
  status: failing
  lines:
    - kw: Given
      text: 'the source let x = 5;'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is let x = 5;'
    - kw: And
      text: 'the statement records the name x and a value expression that prints as 5'
code:
  lang: go
  source: |
    type LetStatement struct { Name *Identifier; Value Expression }
    func (ls *LetStatement) String() string {
      return "let " + ls.Name.String() + " = " + ls.Value.String() + ";"
    }
    // parseStatement dispatches on the first token:
    //   LET -> parseLet, else -> expression statement
checkpoint: Let bindings parse into a statement holding a name and a value. Commit.
---

Until now every "statement" was really just an expression in disguise. A **let
statement** is different: it has fixed structure - the keyword `let`, a name, an
`=`, a value expression, and a semicolon. To handle it, `parseStatement` grows a
**dispatch**: look at the leading token, and if it is `let`, parse a let
statement; otherwise fall back to an expression statement.

That dispatch is the pattern every statement kind will follow, so set it up
cleanly now. Parse the name into an identifier, require the `=`, then reuse
`parseExpression` for the value - the binding's value can be any expression you
have already built, from `5` to `1 + 2 * 3`. Return statements come next, and
they slot into the very same dispatch.
