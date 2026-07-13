---
project: build-a-regex-engine
lesson: 32
title: Finding every match
overview: One match is rarely enough - you want every occurrence. FindAll loops your single-match Find across the text, resuming past each result.
goal: Add FindAllString, returning all non-overlapping matches from left to right.
spec:
  scenario: FindAll returns every non-overlapping match
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "a+"'
    - kw: When
      text: 'FindAllString runs against "xaayaaaz"'
    - kw: Then
      text: 'it returns ["aa", "aaa"]'
    - kw: And
      text: 'FindAllString for "a+" against "zzz" returns an empty result'
    - kw: And
      text: 'FindAllString for "[0-9]+" against "a1b22c333" returns ["1", "22", "333"]'
code:
  lang: go
  source: |
    // Loop Find over the text, starting each search at the END of the
    // previous match. Collect the matched substrings.
    // Guard the empty-match case: if a match is zero-width, advance the
    // start by one byte so you do not loop forever.
checkpoint: FindAllString returns all non-overlapping matches left to right. Commit and stop here.
---

Most real uses want *all* the matches: every number in a line, every tag in a document.
`FindAllString` builds directly on `Find` - find the first match, then search again
starting from where it ended, and repeat until no more matches remain. The matches are
**non-overlapping** because each search resumes past the previous one, so `a+` over
`xaayaaaz` yields `aa` and then `aaa`, never overlapping runs.

There is one classic trap: a pattern that can match the empty string (like `a*`) will
match zero-width at every position, and naively resuming "past the end of the match"
never advances. The standard fix is to bump the start position by one byte whenever a
match is empty, guaranteeing forward progress. With `FindAll` in place, the next lesson's
`ReplaceAll` is a short step away - it walks the very same non-overlapping matches and
substitutes each one.
