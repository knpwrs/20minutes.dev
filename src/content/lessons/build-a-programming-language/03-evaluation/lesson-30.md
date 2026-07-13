---
project: build-a-programming-language
lesson: 30
title: Return statements
overview: A return should stop evaluation and hand its value up, even from inside a block. Today you make that work by wrapping the returned value in a marker object that short-circuits the statement loop.
goal: Evaluate a return statement so it stops the surrounding statements and yields its value.
spec:
  scenario: Return short-circuits evaluation
  status: failing
  lines:
    - kw: Given
      text: 'the source 9; return 2 * 5; 8;'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 10, and the statement after the return is not evaluated'
    - kw: And
      text: 'the source if (true) { return 10; } 9; also evaluates to 10'
code:
  lang: go
  source: |
    type ReturnValue struct { Value Object }
    // eval of a ReturnStatement wraps its value: &ReturnValue{Eval(rs.ReturnValue)}
    // in evalStatements, if a result is a *ReturnValue, stop the loop early
    // and return it, so it bubbles up through enclosing blocks
checkpoint: Return stops the surrounding statements and yields its value, even from inside a block. Commit.
---

`return` has to do something no expression does: **stop** the statements around it
and hand a value back up, possibly through several nested blocks. The trick is a
wrapper object - a `ReturnValue` holding the real value. When the statement loop
sees a result that is a `ReturnValue`, it stops immediately and passes that
wrapper upward instead of continuing.

That is why `9; return 2 * 5; 8;` is `10` and never touches `8`, and why a
`return` inside an `if` block still halts the whole program - the wrapper bubbles
out of the block's statement loop and into the program's. Keeping the value
*wrapped* as it rises matters: in the functions chapter you will **unwrap** it at
the function boundary so a function's return value becomes an ordinary value to
its caller, while an early return still stops the body.
