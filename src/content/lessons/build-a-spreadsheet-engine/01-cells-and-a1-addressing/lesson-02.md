---
project: build-a-spreadsheet-engine
lesson: 2
title: An index back to column letters
overview: A cell address has two directions - parsing it in and printing it back out. Today you build the inverse of yesterday's function so a column index becomes its letters again, which we will need every time the engine reports a cell address.
goal: Convert a zero-based column index back into its column label, the exact inverse of yesterday.
spec:
  scenario: Indices map back to labels
  status: failing
  lines:
    - kw: Given
      text: 'a zero-based column index'
    - kw: When
      text: 'indexToCol is called on it'
    - kw: Then
      text: 'indexToCol(0) is "A", indexToCol(25) is "Z", and indexToCol(26) is "AA"'
    - kw: And
      text: 'indexToCol(27) is "AB", indexToCol(701) is "ZZ", and indexToCol(702) is "AAA"'
code:
  lang: go
  source: |
    // undo the one-based folding: add 1, then peel off letters
    // from the right, decrementing before each modulo.
    func indexToCol(i int) string {
      i++
      out := ""
      for i > 0 {
        i--
        out = string(rune('A'+i%26)) + out
        i /= 26
      }
      return out
    }
checkpoint: Column labels and indices now round-trip in both directions. Commit and stop here.
---

Going the other way is the same one-based quirk in reverse. If you try to treat
the index as ordinary base-26 you get an off-by-one that breaks exactly at the
`Z`-to-`AA` boundary. The fix mirrors yesterday: add one to move back into
one-based counting, then peel off letters from the right, subtracting one *before*
each modulo so that the value `0` maps to `A` rather than to a nonexistent zero
digit.

The pair `colToIndex` and `indexToCol` should be exact inverses: feeding a label
through one and then the other returns the original. That round-trip is worth
checking at the boundaries - `Z` (25), `AA` (26), `ZZ` (701) - because those are
where the naive base-26 version goes wrong. With both directions working, a column
is just an integer to the rest of the engine, and we can always render it back.
