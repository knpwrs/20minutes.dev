---
project: build-an-expression-evaluator
lesson: 7
title: The AST and a number literal
overview: The parser turns a flat token stream into a tree, the abstract syntax tree, whose shape captures how the expression is structured. Today you build the smallest tree, a single number, and give every node a String method so you can read a tree back as text.
goal: Parse a lone number into a Number node whose String renders the value back.
spec:
  scenario: A number parses to a node that renders itself back
  status: failing
  lines:
    - kw: Given
      text: 'the input "42"'
    - kw: When
      text: 'it is parsed and the result is rendered with String'
    - kw: Then
      text: 'the rendering is "42" and no error is returned'
    - kw: And
      text: 'parsing "3.14" renders as "3.14"'
code:
  lang: go
  source: |
    type Expr interface{ String() string }
    type Num struct{ Val float64 }
    func (n *Num) String() string { return strconv.FormatFloat(n.Val, 'g', -1, 64) }
    type Parser struct { toks []Token; pos int }
    func (p *Parser) peek() Token { return p.toks[p.pos] }
    func (p *Parser) next() Token { t := p.toks[p.pos]; p.pos++; return t }
    // Parse can fail later, so it returns an error now even though it never does yet
    func Parse(in string) (Expr, error) {
      p := &Parser{toks: Tokenize(in)}
      t := p.next()               // a Number token
      v, _ := strconv.ParseFloat(t.Text, 64)
      return &Num{v}, nil
    }
checkpoint: A number parses into a Num node that renders itself back as text. Commit and stop here.
---

The parser's output is an **abstract syntax tree** (AST): a tree of nodes where a
number is a leaf and an operator is a branch joining its operands. Representing the
expression as a tree, rather than keeping it as a flat list of tokens, is what makes
precedence and evaluation possible, because the tree's shape **is** the grouping. To
read trees back in tests without depending on any language's struct layout, every
node gets a `String` method that renders it as normalized text; a bare number just
prints its value.

`Parse` returns an error alongside the tree even though a lone number can never fail
to parse. That slot rides along unused for several lessons, but declaring it now
means the error-handling chapter can fill it in without changing the signature every
caller depends on. A `Parser` value holds the token slice and a cursor position, with
`peek` and `next` to look at and advance over tokens; that little cursor is the
machine the whole parser is built on.
