---
project: build-a-regex-engine
lesson: 33
title: Replacing matches
overview: ReplaceAll swaps every match for a replacement string - the feature that turns your matcher into a text-editing tool. It walks the same non-overlapping matches FindAll does.
goal: Add ReplaceAllString, substituting each non-overlapping match with a fixed replacement.
spec:
  scenario: ReplaceAll substitutes every non-overlapping match
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "a+"'
    - kw: When
      text: 'ReplaceAllString runs on "xaayaaaz" with the replacement "-"'
    - kw: Then
      text: 'it returns "x-y-z"'
    - kw: And
      text: 'ReplaceAllString for "[0-9]+" on "a1b22c333" with "#" returns "a#b#c#"'
    - kw: And
      text: 'ReplaceAllString for "x" on "abc" with "-" returns "abc" - no match, unchanged'
code:
  lang: go
  source: |
    // Walk matches like FindAll, but track offsets. Build a result:
    //   copy the text BETWEEN matches verbatim,
    //   emit the replacement in place of each match.
    // Append the trailing text after the last match. Same empty-match
    // guard as yesterday.
checkpoint: ReplaceAllString substitutes every match, copying the gaps verbatim. Commit and stop here.
---

Substitution is what makes regex a daily tool - reformatting dates, stripping
whitespace, redacting fields. `ReplaceAllString` finds every non-overlapping match, and
builds a new string by copying the text *between* matches unchanged while emitting the
replacement in place of each match. `a+` in `xaayaaaz` replaced with `-` gives `x-y-z`;
a pattern that matches nothing leaves the input untouched.

The mechanics reuse yesterday's non-overlapping walk, but now you care about the gaps as
well as the matches. Keep a cursor at the end of the previous match: for each new match,
append the slice from the cursor up to the match start, then append the replacement, then
move the cursor to the match end. After the loop, append whatever text remains. That is
the whole algorithm - and it completes the working set of query and edit operations your
library offers. Tomorrow you polish the public surface and prove it on a real example.
