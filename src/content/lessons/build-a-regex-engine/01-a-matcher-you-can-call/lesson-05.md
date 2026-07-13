---
project: build-a-regex-engine
lesson: 5
title: Anchors for start and end
overview: Anchors let a pattern pin itself to the boundaries of the text. `^` forces a match at the very start and `$` at the very end - two faces of the same idea, opting out of the search-anywhere default.
goal: Parse `^` and `$` into anchor nodes that match a position rather than a character.
spec:
  scenario: Start and end anchors pin the match to text boundaries
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "^ab"'
    - kw: When
      text: 'Match is called against "abx"'
    - kw: Then
      text: 'it reports true, but "^ab" against "xab" reports false'
    - kw: And
      text: 'Match for "c$" against "abc" reports true, and "b$" against "abc" reports false'
    - kw: And
      text: 'Match for "^abc$" against "abc" reports true'
code:
  lang: go
  source: |
    type Begin struct{} // the ^ anchor
    type End struct{}   // the $ anchor
    // Anchors match a position and consume no characters. Begin succeeds only at
    // the start of the text; End only when no characters remain. Thread the
    // start-of-text flag into matchHere so ^ can check where it is.
checkpoint: '`^` and `$` anchor a pattern to the start and end of the text. Commit and stop here.'
---

An **anchor** matches a *position*, not a character - it consumes nothing. `^`
succeeds only at the very start of the text, and `$` succeeds only when there are no
characters left. That is what makes `^ab` reject `xab`: even though `Match` tries
every start position, `^` fails at every position except zero.

There is one wrinkle worth noticing. `matchHere` alone can't tell whether it is
looking at the true start of the text or the middle of a search, so `^` needs to
know its absolute position. The usual fix is to give the matcher that context - a
flag for "are we at the start?" - so a `Begin` node can answer honestly. `$` is
easier: it just checks that the remaining text is empty.
