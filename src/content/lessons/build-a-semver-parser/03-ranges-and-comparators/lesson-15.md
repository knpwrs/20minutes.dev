---
project: build-a-semver-parser
lesson: 15
title: Alternatives with OR
overview: A double bar joins comparator sets as alternatives - satisfy any one of them and you satisfy the range. Today you split on it and fill in the OR layer the Range value was already shaped for.
goal: Split a range on "||" into multiple sets and satisfy the range when any single set matches.
spec:
  scenario: A version satisfies a range when any alternative set matches
  status: failing
  lines:
    - kw: Given
      text: 'the range "1.2.3 || >=2.0.0" parsed with ParseRange'
    - kw: When
      text: 'versions are tested'
    - kw: Then
      text: '1.2.3 satisfies it (the first set) and 2.5.0 satisfies it (the second set)'
    - kw: And
      text: '1.0.0 and 1.9.0 do not satisfy it, since neither the pinned 1.2.3 nor the >=2.0.0 bound matches'
code:
  lang: go
  source: |
    // Split the whole string on "||" FIRST, then parse each piece as an AND-set.
    //   "1.2.3 || >=2.0.0" -> [ [ =1.2.3 ], [ >=2.0.0 ] ]
    // Satisfies stays: true if ANY set is fully satisfied (OR over sets, AND within a set).
checkpoint: Ranges can now express alternatives with OR. Commit and stop here.
---

Sometimes a range needs alternatives: "either exactly `1.2.3`, or anything from
`2.0.0` up." That is what `||` expresses - it joins comparator sets as **OR**. A
version satisfies the whole range if it satisfies **any one** of the sets, and
within each set the comparators are still AND-ed as before. So the range is a
two-level structure: OR on the outside, AND on the inside, which is exactly the
`[][]Comparator` shape you gave `Range` last lesson.

The parse gets one new step at the top: split the input on `||` first, then parse
each piece into an AND-set the way you already do. `1.2.3 || >=2.0.0` becomes two
sets, `[=1.2.3]` and `[>=2.0.0]`, and `Satisfies` returns true if either holds.
Because the value was shaped for this from the start, the change is small -
`Satisfies` grows from "is this one set satisfied" to "is any set satisfied" - and
every single-set range you already handled keeps working, since it is just an OR
with one alternative.
