---
project: build-a-spreadsheet-engine
lesson: 1
title: Column letters to an index
overview: A spreadsheet addresses cells by column letters and row numbers - A1, B7, AA10. Before we can do anything with a cell, we have to turn its column letters into a plain number. Today you convert a column label into a zero-based column index.
goal: Convert a column label like "A", "Z", or "AA" into its zero-based column index.
spec:
  scenario: Column labels map to indices
  status: failing
  lines:
    - kw: Given
      text: 'a column label made of one or more uppercase letters'
    - kw: When
      text: 'colToIndex is called on it'
    - kw: Then
      text: 'colToIndex("A") is 0 and colToIndex("Z") is 25'
    - kw: And
      text: 'colToIndex("AA") is 26, colToIndex("AB") is 27, and colToIndex("ZZ") is 701'
code:
  lang: go
  source: |
    // like base-26, but there is no "zero digit": A..Z are 1..26,
    // and you subtract 1 at the very end to make it zero-based.
    func colToIndex(s string) int {
      n := 0
      for _, c := range s {
        n = n*26 + int(c-'A'+1) // fold each letter in
      }
      return n - 1
    }
checkpoint: You can turn any column label into its zero-based index. Commit and stop here.
---

Every cell in a spreadsheet has an address like `A1` or `AB10`: some column
**letters** followed by a row **number**. The letters name the column, and they
count in a peculiar way - `A` through `Z`, then `AA`, `AB`, ... `AZ`, `BA`, and so
on. It looks like base-26, but it is not quite: there is no digit that means zero,
so `A` is 1, `Z` is 26, and `AA` is 27 in that one-based counting.

To use columns as array indices we want them **zero-based**: `A` is column `0`,
`Z` is column `25`, and `AA` (the 27th column) is index `26`. The trick is to fold
the letters as if they were one-based digits (`A`=1 ... `Z`=26), then subtract one
at the end. That single `- 1` is what turns the letter-counting into an index you
can use everywhere else. Tomorrow you build the inverse.
