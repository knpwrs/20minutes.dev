---
project: build-a-regex-engine
lesson: 16
title: Exact repetition counts
overview: '`{n}` repeats an element an exact number of times. The trick is to expand it into pieces you already know how to match, so the matcher needs no new code.'
goal: Parse `x{n}` into n copies of the element.
spec:
  scenario: An exact count repeats an element n times
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "^a{3}$"'
    - kw: When
      text: 'Match is called against "aaa"'
    - kw: Then
      text: 'it reports true, and "^a{3}$" against "aa" reports false'
    - kw: And
      text: 'Match for "^a{3}$" against "aaaa" reports false'
    - kw: And
      text: 'Match for "a{2}" against "xaaax" reports true'
code:
  lang: go
  source: |
    // Parse the {n} suffix after an atom, then desugar:
    //   x{3}  ->  Concat[x, x, x]
    // Emit n copies of the atom you just parsed. No new matcher case.
checkpoint: '`{n}` repeats an element exactly n times by expanding into copies. Commit and stop here.'
---

`{n}` is a counted quantifier: `a{3}` matches exactly three `a`s. Like the shorthand
classes, it is best handled by **desugaring** at parse time - `a{3}` becomes
`Concat[a, a, a]`, three copies of the atom you just parsed. The matcher never learns
a new trick; it just sees a longer concatenation. The anchored `^a{3}$` in the spec
is there to make the count exact: without anchors, `Match` searches, so `a{3}` would
find three `a`s inside a longer run.

Parsing the suffix is the fresh part: after an atom, a `{` opens a count, you read
the digits, and a `}` closes it. Keep the number handy - tomorrow you extend the same
suffix parser to `{n,m}` and `{n,}`, where a comma introduces a range of allowed
counts instead of a single fixed one.
