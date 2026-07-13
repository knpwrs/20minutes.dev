---
project: build-a-regex-engine
lesson: 7
title: The plus quantifier
overview: '`+` means one or more. It is the star''s sibling and shows how much you get for free once backtracking works - a `+` is just "match one, then a star."'
goal: Parse `x+` into a Plus node that requires at least one match of the preceding element.
spec:
  scenario: Plus requires at least one repetition
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "ab+c"'
    - kw: When
      text: 'Match is called against "ac"'
    - kw: Then
      text: it reports false
    - kw: And
      text: 'Match for "ab+c" against "abc" reports true'
    - kw: And
      text: 'Match for "ab+c" against "abbbc" reports true'
code:
  lang: go
  source: |
    type Plus struct{ Sub any }

    // + is "one required, then zero or more". The cleanest matcher
    // requires one match of Sub and then behaves exactly like Star
    // on what remains. Lean on the code you already wrote yesterday.
checkpoint: '`+` matches one or more repetitions by requiring one, then reusing star behavior. Commit and stop here.'
---

`+` is `*` with a floor of one: `b+` matches one or more `b`s, so `ab+c` rejects `ac`
(zero `b`s) but accepts `abc` and `abbbc`. The reason it earns its own short lesson is
how *little* new code it needs. Once the star's backtracking works, `+` is just
"match one copy of the element, then apply star semantics to the rest."

Reusing yesterday's machinery instead of writing a fresh loop is the habit this
whole engine rewards. Each quantifier is a small variation on "how many times, and
in what order do we try them" - not a new kind of matching. Tomorrow's `?` closes out
the quantifier family the same way.
