---
project: build-an-expression-evaluator
lesson: 8
title: The binding-power loop
overview: This is the heart of the whole project, the Pratt parsing loop. Today you write parseExpr with a minimum binding power and use it to parse addition and subtraction, which naturally group left to right.
goal: Parse a chain of + and - into a left-leaning tree using a binding-power loop.
spec:
  scenario: Left-associative operators group left to right
  status: failing
  lines:
    - kw: Given
      text: 'the input "1 + 2"'
    - kw: When
      text: 'it is parsed and rendered with String'
    - kw: Then
      text: 'the rendering is "(1 + 2)"'
    - kw: And
      text: 'parsing "10 - 3 - 2" renders as "((10 - 3) - 2)", grouping left to right'
code:
  lang: go
  source: |
    type Bin struct { Op string; Left, Right Expr; Pos int }
    func (b *Bin) String() string { return "(" + b.Left.String() + " " + b.Op + " " + b.Right.String() + ")" }
    func infixBP(op string) (int, int, bool) { // left bp, right bp, is-an-infix-op
      if op == "+" || op == "-" { return 10, 11, true }
      return 0, 0, false
    }
    func (p *Parser) parseExpr(minBP int) (Expr, error) {
      lhs, err := p.nud()          // nud reads a number, as in lesson 7
      if err != nil { return nil, err }
      for {
        t := p.peek()
        lbp, rbp, ok := infixBP(t.Text)
        if !ok || lbp <= minBP { break }
        p.next()
        rhs, _ := p.parseExpr(rbp)
        lhs = &Bin{t.Text, lhs, rhs, t.Pos}
      }
      return lhs, nil
    }
checkpoint: A binding-power loop parses left-associative addition and subtraction. Commit and stop here.
---

Here is the Pratt idea in full. Give every infix operator a **binding power**, a
number saying how tightly it pulls on the values around it, and parse with a loop
that carries a `minBP` floor. The loop first reads a left operand (`nud`, "null
denotation", the handler for something with nothing to its left). Then, as long as
the next operator's **left** binding power is above the floor, it consumes that
operator and recursively parses a right operand with the operator's **right** binding
power as the new floor, folding the result into a growing left-hand tree.

The magic is in the two binding powers. Addition has left power `10` and right power
`11`. When the loop recurses for the right operand of the first `-` in `10 - 3 - 2`,
it passes floor `11`; the second `-` has left power `10`, which is **not** above
`11`, so the recursion stops and returns just `3`. The second `-` is then handled by
the outer loop, attaching to the already-built `(10 - 3)`. Right power one higher than
left power is exactly what makes an operator **left-associative**. Store each
operator's position on the node as you build it; error messages will want it later.
