---
project: build-an-llm
lesson: 24
title: Softmax over a row
overview: 'Softmax turns a row of raw numbers into a row of probabilities that sum to 1 - built the numerically careful way from the start, using exp and division from chapter 1.'
goal: Build a softmax function for a single row of Values, guarding against large inputs before exponentiating.
spec:
  scenario: Softmax over a row of three values
  status: failing
  lines:
    - kw: Given
      text: 'the row [1, 2, 3]'
    - kw: When
      text: softmax is applied to the row
    - kw: Then
      text: 'the result is about [0.090031, 0.244728, 0.665241]'
    - kw: And
      text: the three results sum to 1
code:
  lang: go
  source: |
    func SoftmaxRow(row []*Value) []*Value {
      max := row[0].Data
      for _, v := range row {
        if v.Data > max {
          max = v.Data
        }
      }
      // every entry needs shifting by max before Exp, then dividing by
      // the running sum of the shifted, exponentiated entries
      return make([]*Value, len(row))
    }
checkpoint: You have a softmax that turns any row of numbers into a probability distribution over that row's positions. Commit and stop for today.
---

**Softmax** takes a row of arbitrary numbers - they can be negative, unequal in scale, anything - and turns them into a row of probabilities: every entry between 0 and 1, and the whole row summing to exactly 1. The mechanism is `exp` applied to every entry, then each result divided by the sum of all of them, both operations you already have backward rules for from chapter 1.

There is one refinement worth building in from day one rather than bolting on later: a large enough input makes `exp` overflow before you ever get to divide, so production softmax implementations shift every entry by the row's own maximum first, which leaves the final probabilities mathematically unchanged (subtracting a constant from every input of softmax before exponentiating cancels out in the division) while keeping every exponent modest. Work out for yourself why that shift changes nothing about the final answer - it is a good habit to build now, before a later chapter's numbers ever get large enough for it to matter.
