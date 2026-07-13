---
project: build-an-expression-evaluator
lesson: 21
title: Parsing function calls
overview: Functions let expressions do more than arithmetic, and calling one means parsing a name followed by a parenthesized, comma-separated argument list. Today you parse calls into a Call node.
goal: Parse a name followed by parentheses into a Call node with a list of argument expressions.
spec:
  scenario: A name with parentheses parses to a call with arguments
  status: failing
  lines:
    - kw: Given
      text: 'the input "sqrt(16)"'
    - kw: When
      text: 'it is parsed and rendered with String'
    - kw: Then
      text: 'the rendering is "sqrt(16)"'
    - kw: And
      text: 'parsing "max(1, 2, 3)" renders as "max(1, 2, 3)", with three comma-separated arguments'
code:
  lang: go
  source: |
    // tokenizer: a comma separates arguments, so scan it as its own token
    case c == ',':
      toks = append(toks, Token{Comma, ",", i}); i++
    type Call struct { Name string; Args []Expr; Pos int }
    func (c *Call) String() string { /* name + "(" + args joined by ", " + ")" */ }
    // in nud, when the Ident is immediately followed by "(":
    if p.peek().Kind == LParen {
      p.next()                               // consume "("
      var args []Expr
      if p.peek().Kind != RParen {           // allow an empty argument list
        for {
          a, _ := p.parseExpr(0)             // each argument is a fresh expression
          args = append(args, a)
          if p.peek().Kind == Comma { p.next(); continue }
          break
        }
      }
      p.next()                               // consume ")"
      return &Call{t.Text, args, t.Pos}, nil
    }
checkpoint: Function calls parse into Call nodes with a comma-separated argument list. Commit and stop here.
---

A function **call** is an identifier immediately followed by `(`, so the parser
extends the `Ident` case in `nud`: if the next token is a `(`, this is a call rather
than a bare variable. First the tokenizer needs one small addition: a **comma** is
what separates arguments, so give the scanner a rule to emit a `Comma` token for
`,`, the same way it already handles parentheses. Each argument is a **complete expression**, parsed from a fresh
floor of `0` just like a parenthesized group, so `max(1 + 1, 2)` would parse its first
argument as the whole `1 + 1`. Between arguments the parser expects a comma, and it
stops when it sees the closing `)`. Allowing an empty list too means a zero-argument
call like `pi()` parses cleanly.

The `Call` node stores the function name, the list of argument expressions, and the
name's position for later errors. Notice that parsing a call reuses `parseExpr`
recursively for every argument, which is why arguments can themselves be arbitrary
expressions, calls, or nested parentheses. As with grouping, this lesson assumes the
parentheses and commas are well formed; catching a missing comma or an unclosed call
is the errors chapter's concern.
