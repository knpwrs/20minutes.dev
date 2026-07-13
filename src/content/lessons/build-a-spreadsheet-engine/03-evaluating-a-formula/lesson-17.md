---
project: build-a-spreadsheet-engine
lesson: 17
title: Resolving cell references
overview: A formula that cannot read other cells is just a calculator. Today you make the evaluator resolve a cell reference to that cell's current value, treating an empty cell as zero in arithmetic.
goal: Evaluate a CellNode by looking up the referenced cell's value, with Empty reading as zero.
spec:
  scenario: Cell references resolve to stored values
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to 10 and B1 set to 5'
    - kw: When
      text: 'formulas referencing those cells are evaluated'
    - kw: Then
      text: 'eval(parse(''=A1+B1'')) is the Number 15 and eval(parse(''=A1+B1*2'')) is the Number 20'
    - kw: And
      text: 'eval(parse(''=A1+Z9'')) is the Number 10, since the unset cell Z9 reads as zero in arithmetic'
code:
  lang: go
  source: |
    case CellNode:
      return s.get(n.Ref) // the cell's current value (Empty if unset)
    // and in applyBin, coerce operands to numbers:
    func toNum(v Value) float64 {
      switch v.Kind {
      case Number: return v.Num
      case Empty:  return 0 // blank cells count as zero
      }
      return 0
    }
checkpoint: Formulas can now read other cells, with blanks counting as zero. Commit and stop here.
---

This is the lesson that makes it a spreadsheet. Evaluating a `CellNode` means
looking up the referenced cell in the sheet and returning its current value. The
arithmetic helper then coerces those values to numbers before operating, which is
where the **empty-is-zero** rule lives: a blank cell resolves to the `Empty` value,
and in a numeric context `Empty` counts as `0`. That is why `A1+Z9` with `Z9` never
set still evaluates - `Z9` contributes zero, so the result is just `A1`.

Reading cells as zero when blank is the behavior every spreadsheet user relies on:
you write `=A1+B1` before filling in `B1`, and it works, showing `A1` until `B1`
gets a value. The evaluator now depends on the *current* contents of the sheet,
which raises the real question this project is about: when a referenced cell
changes, which formulas need to run again, and in what order? For now we evaluate on
demand; the dependency graph that answers that question is Chapter 4.
