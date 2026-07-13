---
project: build-a-spreadsheet-engine
lesson: 15
title: Ranges and expansion
overview: Functions like SUM operate over a rectangle of cells written A1:B3. Today you parse a range into its own node and expand it into the exact list of cells it covers, which the evaluator will fold over.
goal: Parse a colon-joined reference pair into a RangeNode, and expand a range into its cells in reading order.
spec:
  scenario: A range parses and expands to its cells
  status: failing
  lines:
    - kw: Given
      text: 'a formula containing a range and an expand function over two corners'
    - kw: When
      text: 'the range is parsed and expanded'
    - kw: Then
      text: 'parse(''=SUM(A1:A3)'').String() is ''SUM(A1:A3)'' and expand(A1, B2) is the cells A1, B1, A2, B2'
    - kw: And
      text: 'expand(A1, A3) is A1, A2, A3 and expand(A1, C1) is A1, B1, C1, always in reading order (row by row, left to right)'
code:
  lang: go
  source: |
    type RangeNode struct{ A, B Ref }
    // in primary(), after reading a Cell, if the next token is a Colon,
    // consume it and the second Cell, and return a RangeNode.
    func expand(a, b Ref) []Ref {
      var out []Ref
      for r := a.Row; r <= b.Row; r++ {      // row by row...
        for c := a.Col; c <= b.Col; c++ {    // ...left to right
          out = append(out, Ref{Col: c, Row: r})
        }
      }
      return out
    }
checkpoint: Ranges parse into nodes and expand into their exact cell list. Commit and stop here.
---

A **range** like `A1:B3` names a rectangle of cells by its two opposite corners.
In the parser, a range appears where a cell reference would: after reading a `Cell`
token, if the very next token is a colon, the parser consumes it and the second
reference and builds a `RangeNode` instead of a `CellNode`. That is why colon and
cell tokens were defined together - a range is a cell, a colon, and another cell.

The other half is **expansion**: turning the two corners into the actual list of
cells inside the rectangle. We walk it in **reading order** - row by row, left to
right - so `A1:B2` expands to `A1, B1, A2, B2`. Fixing this order now matters:
later, the dependency graph and recalculation will list cells, and a consistent,
predictable order makes those results exact and reproducible. A one-column range
like `A1:A3` expands to a simple vertical list; a one-row range like `A1:C1` to a
horizontal one. This completes the parser - the next chapter starts turning these
trees into values.
