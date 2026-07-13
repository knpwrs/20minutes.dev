---
project: build-a-spreadsheet-engine
lesson: 4
title: Formatting a reference back to A1
overview: The engine stores cells by coordinate, but people and error messages want A1 addresses. Today you build the inverse of parsing so a (column, row) pair prints back as its A1 reference, completing the round-trip.
goal: Format a (column, row) coordinate back into its A1 reference string.
spec:
  scenario: A coordinate becomes an A1 reference
  status: failing
  lines:
    - kw: Given
      text: 'a zero-based (column, row) coordinate'
    - kw: When
      text: 'formatRef renders it'
    - kw: Then
      text: 'formatRef(col 0, row 0) is "A1" and formatRef(col 1, row 2) is "B3"'
    - kw: And
      text: 'formatRef(col 25, row 0) is "Z1" and formatRef(col 26, row 9) is "AA10", and parseRef and formatRef are inverses'
code:
  lang: go
  source: |
    // column via indexToCol, row is 0-based so add 1 back
    func formatRef(r Ref) string {
      return indexToCol(r.Col) + itoa(r.Row+1)
    }
checkpoint: Coordinates and A1 references now round-trip cleanly. Commit and stop here.
---

This closes the addressing loop. `formatRef` is the mirror of `parseRef`: render
the column index back to letters with `indexToCol`, and turn the zero-based row
back into a one-based row number by adding one. So the coordinate `(0, 0)` prints
as `A1`, and `(26, 9)` prints as `AA10`.

The property to hold onto is that parsing and formatting are exact inverses:
`formatRef(parseRef("AA10"))` is `"AA10"`, and `parseRef(formatRef(c))` is `c`.
That round-trip means the engine can freely move between the internal coordinate it
computes with and the A1 string it shows a user. Every error message, cycle report,
and recalculation trace later in the project will use `formatRef` to name a cell.
