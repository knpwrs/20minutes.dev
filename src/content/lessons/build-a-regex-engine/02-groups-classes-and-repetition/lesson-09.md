---
project: build-a-regex-engine
lesson: 9
title: Grouping with parentheses
overview: Groups give a pattern structure - `(ab)+` repeats a whole sequence, not just one character. Parentheses are the first place your parser calls itself.
goal: Parse `(...)` into a group whose contents a quantifier can repeat as a single unit.
spec:
  scenario: A quantifier applies to a parenthesized group
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "(ab)+c"'
    - kw: When
      text: 'Match is called against "ababc"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'Match for "(ab)+c" against "abc" reports true'
    - kw: And
      text: 'Match for "(ab)+c" against "c" reports false'
code:
  lang: go
  source: |
    type Group struct{ Sub []any } // the sequence inside the parens

    // Parser: when the atom parser sees '(', it parses a whole
    // subexpression and expects a ')'. The Group becomes ONE atom,
    // so + / * / ? attach to it just like they attach to a letter.
    // Matcher: a Group matches its Sub nodes, then the pattern
    // continues after the group. For a *quantified* group like (ab)+,
    // your quantifier needs to know how many characters one repetition
    // of the group consumed - so a helper that matches Sub and returns
    // that length (or -1 on failure) is the piece to add today.
checkpoint: Parentheses group a subexpression so a quantifier can repeat the whole thing. Commit and stop here.
---

Until now every quantifier attached to a single character. `(ab)+` needs to repeat a
whole **sequence**, and a flat list of nodes has nowhere to hang that sequence. The
fix is grouping: when the atom parser meets `(`, it recursively parses a full
subexpression and stops at the matching `)`, wrapping the result in a single `Group`
node. Because the group is one atom, `+`, `*`, and `?` bind to it exactly as they
would to a letter.

Matching a group is where your recursive matcher earns its keep. A `Group` matches
its inner nodes and then lets the rest of the pattern continue from wherever the
group left off - the same "rest against rest" hand-off from lesson 2, now spanning a
nested sequence. If your matcher walks a list of nodes, the cleanest trick is to
treat the group's contents as if they were spliced into the stream ahead of what
follows. One gotcha to note and set aside: a group that can match empty (like
`(a?)*`) can make a backtracking matcher loop - we'll confront exactly that in
chapter three.
