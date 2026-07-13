---
project: build-a-json-parser
lesson: 31
title: Pointer escapes
overview: A slash separates pointer tokens, so a key that literally contains a slash needs an escape - and so does the escape character itself. Today you decode the two JSON Pointer escapes, getting their tricky order right.
goal: Decode the tilde-1 and tilde-0 escapes within each reference token.
spec:
  scenario: Decoding pointer escapes
  status: failing
  lines:
    - kw: Given
      text: 'a pointer whose tokens contain escapes'
    - kw: When
      text: 'ParsePointer is called'
    - kw: Then
      text: 'ParsePointer("/a~1b") is the single token a-slash-b, and ParsePointer("/m~0n") is the single token m-tilde-n'
    - kw: And
      text: 'ParsePointer("/~01") is the single token tilde-1 (decode left to right: tilde-0 becomes a tilde, then a literal 1)'
code:
  lang: go
  source: |
    // decode each reference token left to right:
    //   on '~', look at the next char:
    //     '1' -> '/'      '0' -> '~'
    //     anything else (or end) -> invalid escape (error)
    //   any other char -> itself
    // single left-to-right pass gets "~01" -> "~1" right
checkpoint: Pointer tokens decode their tilde escapes correctly. Commit and stop here.
---

Because `/` separates tokens, a key that literally contains a slash cannot be written
raw. JSON Pointer escapes it as `~1`. That makes `~` itself special, so a literal
tilde is written `~0`. These are the only two escapes, and they are decoded **inside**
each reference token after the pointer is split on slashes.

The order matters and is a classic trap. Decoding must be a single **left-to-right**
pass, or equivalently "replace `~1` then `~0`" - never the reverse. Consider `~01`:
scanning left to right, `~0` decodes to `~`, then the `1` is literal, giving `~1`. If
you naively replaced `~0` with `~` and then `~1` with `/` in two passes, that `~1`
would wrongly become `/`. A single pass that looks at the character after each `~`
avoids the mistake entirely, and an `~` followed by anything but `0` or `1` is an
invalid escape.
