---
project: build-a-spreadsheet-engine
lesson: 35
title: Unknown names and bad references
overview: Two more errors complete the set - calling a function that does not exist, and using a reference where it makes no sense. Today you add #NAME? and #REF!, both of which propagate like the errors before them.
goal: Return #NAME? for an unknown function and #REF! for a range used where a single value is expected.
spec:
  scenario: Bad names and misused references error
  status: failing
  lines:
    - kw: Given
      text: 'formulas that call an unknown function or misuse a range'
    - kw: When
      text: 'they are evaluated'
    - kw: Then
      text: 'eval(''=FOO(1)'') is the Error ''#NAME?'' since FOO is not a known function'
    - kw: And
      text: 'eval(''=A1:A3'') is the Error ''#REF!'' - a bare range is not a single value - and eval(''=1+A1:A3'') is ''#REF!'' as well'
code:
  lang: go
  source: |
    // in evalCall, the default case (no matching function name):
    default:
      return Value{Kind: Err, Code: "#NAME?"}
    // evaluating a RangeNode outside a function argument:
    case RangeNode:
      return Value{Kind: Err, Code: "#REF!"} // a range is not a scalar
checkpoint: Unknown functions and misused ranges now error cleanly. Commit and stop here.
---

Two final error kinds round out the set. `#NAME?` is what the evaluator returns
when a `CallNode` names a function it does not recognize - the `default` case of the
function dispatch. Type `=FOO(1)` and, since `FOO` is not one of the six functions,
the cell shows `#NAME?` rather than silently returning nothing. `#REF!` covers a
**bad reference**: a range like `A1:A3` is only meaningful *inside* a function that
expects one (like `SUM`), so using it as a plain value - `=A1:A3`, or `=1+A1:A3` -
is a reference error.

Both new errors flow through the propagation rule from the last lesson: a cell that
reads a `#NAME?` cell becomes `#NAME?`, and a `SUM` over a range holding an error is
that error. The engine now has the full family - `#CIRC!` for cycles, `#DIV/0!` for
division, `#NAME?` for unknown functions, `#REF!` for bad references - and every one
of them spreads correctly downstream. With errors handled, the last piece of the
core is making an ordinary edit trigger a recalculation automatically.
