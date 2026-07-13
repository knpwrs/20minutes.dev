---
project: build-a-glob-matcher
lesson: 6
title: Ranges in a class
overview: 'A class can name a range with a dash, so [a-z] means every lowercase letter and [0-9] every digit. Today the class scanner learns to read a low-dash-high triple and test whether the character falls in the span.'
goal: 'Make a dash inside a class denote an inclusive character range.'
spec:
  scenario: A dash denotes an inclusive range of characters
  status: failing
  lines:
    - kw: Given
      text: 'classes that contain a range'
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'Match("[a-z]", "m") is true, Match("[a-z]", "M") is false, and Match("[0-9]", "5") is true'
    - kw: And
      text: 'a class can mix ranges and singles: Match("[a-cx-z]", "y") is true and Match("[a-cx-z]", "m") is false'
code:
  lang: go
  source: |
    // inside the class scan, look for a low-dash-high triple
    if j+2 < len(pat) && pat[j+1] == '-' && pat[j+2] != ']' {
      if pat[j] <= c && c <= pat[j+2] { matched = true }
      j += 3            // consumed low, '-', high
    } else {
      if pat[j] == c { matched = true }
      j++
    }
checkpoint: 'A dash inside a class matches an inclusive range. Commit and stop here.'
---

Listing every character gets old fast, so a class lets you write a **range** with a
dash: `[a-z]` is every character from `a` through `z`, `[0-9]` every digit. The
comparison is just on the character's code, so `[a-z]` matches `m` but not `M` -
uppercase sits in a different part of the table. A class can mix ranges and plain
members freely: `[a-cx-z]` accepts `a`, `b`, `c`, `x`, `y`, `z`, so it matches `y`
but not `m`.

The scanner change is small: at each position, peek ahead - if the next character
is a `-` and the one after it is not the closing `]`, read the three characters as a
`low-dash-high` range and test whether the name character falls inside it;
otherwise treat the character as a single member as before. Guarding that the
character after the dash is not `]` is what keeps a trailing dash (as in `[a-]`) from
being mistaken for an unfinished range - that literal-dash case is a lesson of its
own shortly.
