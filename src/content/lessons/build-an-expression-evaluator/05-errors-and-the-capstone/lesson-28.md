---
project: build-an-expression-evaluator
lesson: 28
title: Undefined names
overview: The temporary failures for unknown variables and functions can now become precise. Today you give both a clear, positioned message using the position each node has carried since it was parsed.
goal: Report positioned errors for an undefined variable and an undefined function.
spec:
  scenario: Unknown variables and functions are reported with position
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "y + 1" with an empty environment'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'evaluation fails with: undefined variable: y at position 0'
    - kw: And
      text: 'evaluating "foo(2)" fails with: undefined function: foo at position 0, and "1 + z" fails with: undefined variable: z at position 4 (the position tracks where the name actually appears)'
code:
  lang: go
  source: |
    // Var lookup: upgrade the temporary message to a positioned one
    if !ok {
      return 0, fmt.Errorf("undefined variable: %s at position %d", n.Name, n.Pos)
    }
    // Call dispatch: the fall-through for an unknown name becomes
    return 0, fmt.Errorf("undefined function: %s at position %d", n.Name, n.Pos)
checkpoint: Undefined variables and functions report clear, positioned errors. Commit and stop here.
---

Two lessons left placeholder errors behind: the variable lookup and the function
dispatch each failed with a bare message and no position. Now that the errors chapter
is establishing a consistent `<what> at position <n>` style, upgrade both. The `Var`
node has carried its name's position since you first parsed it, and the `Call` node
has carried the function name's position, so `y + 1` reports the unknown `y` at
position `0`, and `foo(2)` reports the unknown `foo` at position `0`.

Consistency is the point. A user who mistypes a name, whether it is meant to be a
variable or a function, gets the same shape of message pointing at the same place. The
evaluator now handles the three ways evaluation can go wrong from bad references and
arithmetic: a divide by zero, an unknown variable, and an unknown function. One class
of mistake remains, calling a known function the wrong way, and that is next.
