---
project: build-a-regex-engine
lesson: 3
title: Searching anywhere in the text
overview: A real regex finds a match anywhere in the text, not just at the start. Today you wrap yesterday's prefix check in a search loop and expose your first public function, Match.
goal: Add Match, which reports true if the pattern matches starting at any position in the text.
spec:
  scenario: Searching for a match at any position
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "bcd"'
    - kw: When
      text: 'Match is called against "abcde"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'Match for "xyz" against "abcde" reports false'
    - kw: And
      text: 'Match for "" against "abc" reports true'
code:
  lang: go
  source: |
    // try matchHere at position 0, then 1, then 2 ... up to the end.
    // remember to try the empty tail so "" and "$" can match.
    func Match(pat, text string) bool {
        nodes := parse(pat).Nodes
        // for i := 0; i <= len(text); i++ { ... }
    }
checkpoint: Match searches the whole text for the pattern. Your engine has a public entry point. Commit and stop here.
---

Yesterday's `matchHere` only looked at the front of the text. A search engine has
to consider every starting position: `bcd` is *in* `abcde`, just not at index 0. So
`Match` tries `matchHere` at position 0, then 1, then 2, and reports true the first
time one succeeds. This unanchored, match-anywhere behavior is the default your
whole library will follow - tomorrow's `^` is how a user opts *out* of it.

Note the loop runs to `len(text)` **inclusive**, not exclusive: an empty pattern,
and later the `$` anchor, need a chance to match at the very end where no bytes
remain. `Match` is now your public surface - a caller passes a pattern and some
text and gets a yes or no. Everything from here just makes that yes-or-no smarter.
