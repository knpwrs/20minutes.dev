---
project: build-a-regex-engine
lesson: 12
title: Ranges in character classes
overview: Ranges like `a-z` let a class cover a whole span without listing every character. It is a small addition to the class sub-parser with a big reach.
goal: Expand a `a-z` range inside a class into every character it covers.
spec:
  scenario: A range inside a class covers a span of characters
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "[a-z]"'
    - kw: When
      text: 'Match is called against "5x9"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'Match for "[a-z]" against "123" reports false'
    - kw: And
      text: 'Match for "[a-f0-3]" against "g7" reports false, and against "q3q" reports true'
code:
  lang: go
  source: |
    // Inside a class, a byte followed by '-' and another byte is a
    // range: add every character from lo to hi to the set. A '-'
    // that isn't between two characters is just a literal '-'.
    for c := lo; c <= hi; c++ { set[c] = true }
checkpoint: Ranges like `a-z` and `0-9` expand inside a class. Commit and stop here.
---

A range is shorthand: `[a-z]` means "every character from `a` through `z`". While
parsing the inside of a class, when you see a character, then a `-`, then another
character, you expand the whole span into the set rather than adding three literal
bytes. Multiple ranges and loose characters can share one class - `[a-f0-3]` accepts
`a` through `f` and `0` through `3` - because each piece just adds to the same set.

The one edge case to keep in mind is a `-` that isn't sandwiched between two
characters, like `[-a]` or `[a-]`. There it is a literal hyphen, not a range. You
don't have to handle every corner today, but knowing the rule keeps your sub-parser
honest as classes get more expressive tomorrow with negation.
