---
project: build-a-glob-matcher
lesson: 7
title: A negated class
overview: 'A class that starts with a bang or a caret means the opposite - match any one character that is not in the set. Today the scanner reads that leading marker and inverts its verdict.'
goal: 'Make a leading bang or caret negate a character class.'
spec:
  scenario: A leading bang or caret inverts the class
  status: failing
  lines:
    - kw: Given
      text: 'classes that begin with a negation marker'
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'Match("[!abc]", "d") is true and Match("[!abc]", "a") is false'
    - kw: And
      text: 'the caret works the same: Match("[^0-9]", "x") is true, Match("[^0-9]", "5") is false, and a negated range Match("[!a-z]", "5") is true'
code:
  lang: go
  source: |
    // right after the opening '[', check for a negation marker
    negate := false
    if j < len(pat) && (pat[j] == '!' || pat[j] == '^') {
      negate = true
      j++          // skip the marker; scan the members after it
    }
    // ... scan members as before ...
    if negate { matched = !matched }
checkpoint: 'A leading bang or caret negates a class. Commit and stop here.'
---

A class can be flipped: if the character right after the `[` is a `!` (the POSIX
spelling) or a `^` (the common alternative), the class matches any single character
that is **not** in the set. So `[!abc]` matches `d` but not `a`, and `[^0-9]`
matches any non-digit. It still consumes exactly one character - negation changes
*which* characters pass, not how many.

The implementation is a marker check and a final flip: note the leading `!` or `^`,
skip it, scan the members exactly as before (ranges included, so `[!a-z]` negates
the whole span), and invert the result at the end. Because the flip happens after
the normal membership test, everything you have already built - single members and
ranges - keeps working unchanged inside a negated class.
