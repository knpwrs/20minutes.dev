---
project: build-a-spreadsheet-engine
lesson: 3
title: Parsing an A1 reference
overview: A full cell address glues column letters to a row number. Today you split an A1-style reference into a (column, row) pair - the coordinate the whole engine uses internally to find a cell.
goal: Parse a reference like "A1" or "AA10" into a zero-based (column, row) coordinate.
spec:
  scenario: An A1 reference becomes a coordinate
  status: failing
  lines:
    - kw: Given
      text: 'a reference of column letters followed by a row number, like "A1" or "AA10"'
    - kw: When
      text: 'parseRef splits it into a column index and a row index'
    - kw: Then
      text: 'parseRef("A1") is column 0, row 0, and parseRef("B3") is column 1, row 2'
    - kw: And
      text: 'parseRef("Z1") is column 25 row 0, parseRef("AA10") is column 26 row 9, and parseRef("AB10") is column 27 row 9'
code:
  lang: go
  source: |
    type Ref struct{ Col, Row int }
    // scan the leading letters, then the trailing digits.
    func parseRef(s string) Ref {
      i := 0
      for i < len(s) && s[i] >= 'A' && s[i] <= 'Z' {
        i++
      }
      col := colToIndex(s[:i])
      // row in A1 is 1-based; make it 0-based
      // row := atoi(s[i:]) - 1
      return Ref{Col: col, Row: /* fill in */ 0}
    }
checkpoint: You can turn any A1 reference into an internal (column, row) coordinate. Commit and stop here.
---

An A1 reference is two parts stuck together: a run of column **letters** and then a
row **number**. Parsing it is just finding the boundary - the first digit - and
handing the letter part to yesterday's `colToIndex`. The digits are the row.

The one subtlety is that rows in A1 notation are **one-based**: `A1` is the first
row, not the zeroth. Internally we want zero-based indices everywhere so a cell is
a clean pair of array coordinates, so subtract one from the row number. That makes
`A1` the coordinate `(0, 0)` - column zero, row zero - and `AA10` the coordinate
`(26, 9)`. Keeping the column zero-based (from lesson 1) and the row zero-based
here means the two axes are symmetric, and every later lesson can treat a cell as a
plain `(col, row)`.
