---
project: build-a-regex-engine
lesson: 10
title: Alternation
overview: '`|` chooses between two alternatives and sits at the very bottom of the grammar''s precedence. It is the last big piece of regex structure.'
goal: Parse `a|b` into an Alt node and match text against either branch.
spec:
  scenario: Alternation matches either branch, at the lowest precedence
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "cat|dog"'
    - kw: When
      text: 'Match is called against "dog"'
    - kw: Then
      text: 'it reports true, and "cat|dog" against "cot" reports false'
    - kw: And
      text: 'Match for "gr(a|e)y" against "grey" reports true'
    - kw: And
      text: 'precedence holds: "ab|cd" matches "ab" and "cd" but not "abd" - it parses as (ab)|(cd), not a(b|c)d'
code:
  lang: go
  source: |
    type Alt struct{ Left, Right []any }

    // Precedence: | binds LOOSER than concatenation, so "ab|cd"
    // splits into (ab) | (cd), not a(b|c)d. Parse a full concat for
    // each side. Matching: try the Left branch; if it fails, try Right.
checkpoint: '`|` matches either alternative, and binds looser than concatenation. Commit and stop here.'
---

Alternation is a choice: `cat|dog` matches wherever *either* word appears. The one
thing you must get right is **precedence**. `|` is the loosest operator in the
grammar, looser than gluing characters together, so `ab|cd` means "(ab) or (cd)", not
"a, then (b or c), then d". In a recursive-descent parser that falls out naturally if
alternation is the *outermost* level: parse a whole concatenation for the left side,
and if you see a `|`, parse another whole concatenation for the right.

Matching an `Alt` is pure backtracking: try the left branch and let the rest of the
pattern continue; if that fails, try the right. With grouping from yesterday, `|`
also works *inside* parentheses - `gr(a|e)y` matches `gray` and `grey` - because the
group parses its contents through the same alternation-topped grammar. That closes
the structural core of regex syntax; the rest of this chapter enriches what a single
element can match.
