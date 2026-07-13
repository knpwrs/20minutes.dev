---
project: build-a-spreadsheet-engine
lesson: 22
title: Evaluating comparisons
overview: The parser builds comparison nodes; now the evaluator turns them into booleans. Today you evaluate the six comparison operators to a Bool value, which IF will branch on next.
goal: Evaluate a comparison node to a Bool value by comparing its two numeric sides.
spec:
  scenario: Comparisons evaluate to booleans
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to 5'
    - kw: When
      text: 'comparison formulas are evaluated'
    - kw: Then
      text: 'eval(''=A1>0'') is the Bool true and eval(''=A1<0'') is the Bool false'
    - kw: And
      text: 'eval(''=A1>=5'') is the Bool true and eval(''=A1<>5'') is the Bool false'
code:
  lang: go
  source: |
    // in applyBin, the comparison operators return a Bool
    case ">":  return Value{Kind: Bool, B: toNum(l) > toNum(r)}
    case "<":  return Value{Kind: Bool, B: toNum(l) < toNum(r)}
    case ">=": return Value{Kind: Bool, B: toNum(l) >= toNum(r)}
    case "<=": return Value{Kind: Bool, B: toNum(l) <= toNum(r)}
    case "=":  return Value{Kind: Bool, B: toNum(l) == toNum(r)}
    case "<>": return Value{Kind: Bool, B: toNum(l) != toNum(r)}
checkpoint: Comparison formulas now evaluate to true or false. Commit and stop here.
---

The comparison nodes have been parsing since Chapter 2; now they get meaning.
Evaluating a comparison is like evaluating arithmetic - walk both sides to values -
but instead of returning a number, `applyBin` compares the two numbers and returns a
`Bool`. All six operators live here: greater/less, the or-equal variants, equality
(`=`), and not-equal (`<>`). Over `A1 = 5`, the formula `A1>0` is `true` and `A1<0`
is `false`.

Producing a real boolean value (not a `1` or `0`) is what lets the next lesson's
`IF` branch cleanly on a condition. It also means the `Bool` kind you defined all
the way back in the value type is finally being generated, not just reserved.
Comparisons here coerce their sides to numbers before comparing, which keeps the
behavior simple and predictable for the numeric spreadsheets this engine targets;
comparing text or booleans directly is a refinement a later extension could add.
