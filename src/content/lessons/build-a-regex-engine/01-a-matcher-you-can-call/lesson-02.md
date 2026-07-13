---
project: build-a-regex-engine
lesson: 2
title: Matching a literal prefix
overview: Now you make the tree do something - check whether text begins with the pattern's literal characters. This recursive walk is the spine every operator will later extend.
goal: Write matchHere so it reports whether the text starts with the pattern's literals.
spec:
  scenario: Matching literals at the start of the text
  status: failing
  lines:
    - kw: Given
      text: 'the parsed pattern "abc"'
    - kw: When
      text: 'matchHere is called against "abcd"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'matchHere for "abc" against "ab" reports false'
    - kw: And
      text: 'matchHere for "" against any text reports true'
code:
  lang: go
  source: |
    // does the text begin with everything in these nodes?
    // empty pattern matches anything; otherwise the first node
    // must match the first byte, then recurse on the rest.
    func matchHere(nodes []any, text string) bool { /* ... */ }
checkpoint: matchHere reports whether text begins with a literal pattern. Commit and stop here.
---

Matching is a recursion on the tree. `matchHere` asks a narrow question: *does the
text begin with these nodes, in order?* An empty list of nodes matches trivially -
there is nothing left to require - so it returns true. Otherwise the first node has
to match the first byte of the text, and then the **rest** of the nodes have to
match the **rest** of the text.

That "rest against rest" step is the whole idea, and it is why the tree pays off:
each node kind only has to know how to match itself and hand the remaining text to
whatever follows. Today every node is a `Literal`, so "match the first byte" just
means comparing two bytes - but the shape you write now is the one `.`, `*`, and
groups will all plug into.
