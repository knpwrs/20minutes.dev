---
project: build-a-spreadsheet-engine
lesson: 21
title: COUNT and AVERAGE
overview: The last two aggregates are COUNT, which tallies numeric cells, and AVERAGE, which is a sum over a count. Today you add both, and see how ignoring non-numbers keeps the average honest.
goal: Add COUNT as the number of numeric values and AVERAGE as their sum divided by that count.
spec:
  scenario: COUNT tallies numbers and AVERAGE means them
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1, A2, A3 set to 1, 2, 3'
    - kw: When
      text: 'COUNT and AVERAGE are evaluated over the range'
    - kw: Then
      text: 'eval(''=COUNT(A1:A3)'') is the Number 3 and eval(''=AVERAGE(A1:A3)'') is the Number 2'
    - kw: And
      text: 'after A2 is set to the text "hi", eval(''=COUNT(A1:A3)'') is the Number 2 and eval(''=AVERAGE(A1:A3)'') is the Number 2 (the sum 4 over the count 2, ignoring text)'
code:
  lang: go
  source: |
    case "COUNT":
      return Value{Kind: Number, Num: float64(len(s.numArgs(n.Args)))}
    case "AVERAGE":
      xs := s.numArgs(n.Args)
      if len(xs) == 0 { /* #DIV/0! later; for now guard */ }
      sum := 0.0
      for _, x := range xs { sum += x }
      return Value{Kind: Number, Num: sum / float64(len(xs))}
checkpoint: COUNT and AVERAGE complete the aggregate function set. Commit and stop here.
---

`COUNT` returns how many of its arguments' values are **numbers** - it is just the
length of the gathered-numbers list. `AVERAGE` is a sum divided by that same count.
Both lean entirely on the argument helper's rule that only `Number` values survive,
and that rule is what makes them behave correctly on mixed data: over `1, 2, 3` the
count is `3` and the average `2`, but replace `A2` with the text `"hi"` and the
count drops to `2` while the average becomes `4 / 2`, still `2` - the text is
skipped, not treated as zero.

That "skip non-numbers" behavior is subtly different from arithmetic, where a blank
cell counts as zero. In a range aggregate, a blank or text cell is simply not part
of the population, so it changes the count. This is the honest spreadsheet behavior
and it matters for `AVERAGE` especially, where counting blanks as zeros would drag
the mean down. The one lurking edge - averaging an empty range, a division by zero -
is a real error we are not equipped to represent yet; the errors chapter gives it
the `#DIV/0!` it deserves.
