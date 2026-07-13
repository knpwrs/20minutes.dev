---
project: build-a-semver-parser
lesson: 20
title: X-ranges and the wildcard
overview: An x-range leaves part of a version open with an x or a star, standing for any value there. Today you desugar "1.x" and its relatives, completing the range grammar.
goal: Expand "1.x" into ">=1.0.0 <2.0.0", "1.2.x" into ">=1.2.0 <1.3.0", and "*" into ">=0.0.0".
spec:
  scenario: A wildcard component becomes a bounded span
  status: failing
  lines:
    - kw: Given
      text: 'the ranges "1.x", "1.2.x" and "*" parsed with ParseRange'
    - kw: When
      text: 'versions are tested'
    - kw: Then
      text: '1.0.0 and 1.9.9 satisfy "1.x" (it means ">=1.0.0 <2.0.0") but 2.0.0 does not, and 1.2.5 satisfies "1.2.x" (">=1.2.0 <1.3.0") while 1.3.0 does not'
    - kw: And
      text: '"*" matches every release, including 0.0.1 and 9.9.9'
code:
  lang: go
  source: |
    // A component of "x", "X", or "*" (or simply missing) is a wildcard.
    //   major wildcard ("*")   -> >=0.0.0
    //   minor wildcard ("1.x") -> >=1.0.0 <2.0.0
    //   patch wildcard ("1.2.x")-> >=1.2.0 <1.3.0
    // This is the "no operator" default token path from lesson 13, generalized to partials.
checkpoint: X-ranges complete the range grammar. Commit and stop here.
---

The last piece of sugar is the **x-range**, where a component is left open with
`x`, `X`, or `*` (or simply omitted). A wildcard component matches any value
there, which becomes a bounded span. `1.x` fixes the major and lets the rest vary:
`>=1.0.0 <2.0.0`. `1.2.x` fixes major and minor: `>=1.2.0 <1.3.0`. And a bare `*`
fixes nothing, so it matches every release: `>=0.0.0`. Notice `1.x` and `^1.0.0`
land on the same span from different directions - the wildcard says "any value
here," the caret says "keep the left-most non-zero fixed."

This is a natural extension of the "no operator means `=`" path from the single
comparator lesson: a bare token with all three numbers is still an exact match, but
now a bare token with a wildcard or a missing component expands to a span instead.
Generalize that default branch to look for `x`/`X`/`*`/missing at each position and
emit the matching bounds. With x-ranges in place the range grammar is complete -
comparators, sets, OR, hyphen, tilde, caret, and wildcards all lower to plain
comparators, and `Satisfies` answers them all.
