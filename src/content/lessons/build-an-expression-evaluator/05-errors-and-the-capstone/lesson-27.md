---
project: build-an-expression-evaluator
lesson: 27
title: Division and modulo by zero
overview: Parsing errors are handled, so the focus shifts to evaluation errors. Today you turn division and modulo by zero into clear, positioned messages instead of the infinities and not-a-number values they silently produce.
goal: Report a positioned error for division or modulo by zero.
spec:
  scenario: Dividing or taking a remainder by zero is reported
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "10 / 0"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'evaluation fails with: division by zero at position 3'
    - kw: And
      text: 'evaluating "5 % 0" fails with: modulo by zero at position 2'
code:
  lang: go
  source: |
    case "/":
      if r == 0 { return 0, fmt.Errorf("division by zero at position %d", n.Pos) }
      return l / r, nil
    case "%":
      if r == 0 { return 0, fmt.Errorf("modulo by zero at position %d", n.Pos) }
      return math.Mod(l, r), nil
checkpoint: Division and modulo by zero report a positioned error instead of infinity or not-a-number. Commit and stop here.
---

Floating point does not fault on division by zero; `10 / 0` quietly yields an
infinity and `5 % 0` a not-a-number, both useless answers a user would rather see
rejected. Guard the divisor: if the right operand evaluates to `0`, return an error
instead of computing. This is the first **evaluation** error, and it is where the
position you stored on every `Bin` node back in the parsing chapter earns its keep,
letting the message point at the operator, position `3` for the `/` in `10 / 0`.

Storing positions on nodes at parse time, long before any error could use them, is
what makes evaluation errors as precise as parse errors. The evaluator has the whole
tree, but the raw string is long gone; without the position captured on the node, the
best it could say is "division by zero" with no idea where. That foresight is why the
front-loaded `Pos` field was worth carrying unused for twenty lessons.
