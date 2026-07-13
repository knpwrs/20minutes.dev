---
project: build-a-glob-matcher
lesson: 8
title: A literal bracket or dash in a class
overview: 'A class needs a way to contain the very characters that structure it. POSIX handles this by position - a closing bracket right after the open is a literal member, and a dash at the start or end is a literal dash. Today the scanner honours both.'
goal: 'Let a class hold a literal closing bracket or dash by position.'
spec:
  scenario: A leading bracket and an edge dash are literal members
  status: failing
  lines:
    - kw: Given
      text: 'classes whose members include a bracket or a dash'
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'a bracket right after the open is a member: Match("[]a]", "]") is true, Match("[]a]", "a") is true, and Match("[]a]", "b") is false'
    - kw: And
      text: 'a dash at the end is literal: Match("[a-]", "-") is true, Match("[a-]", "a") is true, and Match("[a-]", "z") is false'
code:
  lang: go
  source: |
    first := j        // position of the first member (after any '!' or '^')
    for j < len(pat) {
      if pat[j] == ']' && j > first { break }   // a ']' past the first slot closes
      // a '-' is a range only when a real 'high' follows (not ']')
      // ... otherwise it is a literal member
    }
checkpoint: 'A class can hold a literal bracket or dash by position. Commit and stop here.'
---

A class has to be able to contain `]` and `-`, the characters that give it its
shape. POSIX resolves the ambiguity with **position** rather than escaping: a `]`
that appears **immediately** after the opening `[` (or after the `!` or `^`) is a
plain member, not the closing bracket - so `[]a]` is the class of `]` and `a`. A
`-` is a range only when it sits **between** two characters; at the start or end of
the list it is a literal dash, so `[a-]` matches `a` or `-`.

Both fall out of two small guards in the scan. First, only treat a `]` as the
terminator when it is **past** the first member slot, so a leading `]` is read as a
member. Second - which lesson 6 already set up - only read a `-` as a range when a
non-`]` character follows it; otherwise it is an ordinary member. With these, a
class can hold every character it needs to without any escape mechanism at all.
