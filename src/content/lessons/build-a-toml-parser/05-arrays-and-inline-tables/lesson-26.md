---
project: build-a-toml-parser
lesson: 26
title: Multiline and mixed arrays
overview: 'Arrays in real config span lines and mix types. Today you let an array break across lines with comments and a trailing comma, nest, and hold values of different types.'
goal: 'Parse a multiline array with a trailing comma, nesting, and mixed element types.'
spec:
  scenario: Multiline, nested, heterogeneous arrays
  status: failing
  lines:
    - kw: Given
      text: 'an array written across several lines with a comment after an element and a trailing comma after the last element, holding 1, 2, 3'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the value is the array of integers 1, 2, 3 (the trailing comma and the newlines and the comment are ignored)'
    - kw: And
      text: 'a nested array open-bracket open-bracket 1, 2 close-bracket, open-bracket 3 close-bracket close-bracket parses as two subarrays, and a mixed array open-bracket 1, "two", true close-bracket is allowed in TOML 1.0'
code:
  lang: go
  source: |
    // inside an array, treat newlines as insignificant:
    //   skip whitespace AND newlines AND # comments between tokens
    // allow one trailing comma before the closing ']'
    // element values may be arrays (recurse) or any type; TOML 1.0
    //   does NOT require the elements to share a type
checkpoint: 'Arrays span lines, allow a trailing comma, nest, and mix types. Commit and stop here.'
---

Unlike a bare scalar, an **array may span multiple lines**, which is how long lists
stay readable. Inside the brackets, newlines are insignificant: whitespace,
line breaks, and `#` comments between elements and commas are all skipped. TOML also
permits **one trailing comma** after the last element, so a list can be edited
line-by-line without fiddling with the final comma. Both are pure convenience, and
the parsed value is the same as the one-line form.

Two more rules round out arrays. They **nest** - an element can be another array, so
`[[1, 2], [3]]` is an array of two subarrays - which falls out naturally from the
recursive parse. And in TOML 1.0 an array is **heterogeneous**: its elements need
not share a type, so `[1, "two", true]` is a perfectly valid array of an integer, a
string, and a boolean. (Earlier TOML drafts required one type; 1.0 dropped that.)
Skipping newlines and comments inside the brackets is the main new work; the rest is
letting the recursion and the value dispatch do their job.
