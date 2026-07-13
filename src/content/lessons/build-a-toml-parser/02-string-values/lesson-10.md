---
project: build-a-toml-parser
lesson: 10
title: Multiline basic strings
overview: 'Some values span several lines. Today you parse a multiline basic string, delimited by three double quotes, which keeps embedded newlines and trims a single newline immediately after the opening delimiter.'
goal: 'Parse a triple-double-quoted multiline string with the leading-newline trim.'
spec:
  scenario: A multiline basic string
  status: failing
  lines:
    - kw: Given
      text: 'a value opened with three double quotes, then a newline, then the lines first and second each followed by a newline, then three closing double quotes'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the value is exactly first, a newline, second, a newline (the newline right after the opening delimiter is trimmed)'
    - kw: And
      text: 'escapes still work inside, and the whole thing may be on one line, so three-quote a-b-c three-quote is the string abc'
code:
  lang: go
  source: |
    // a value opening with '"""' is a multiline basic string
    //   read everything up to the closing '"""'
    //   if the content begins with a newline, drop that one newline
    //     (a "\r\n" right after the opener counts as the one newline)
    //   process escapes exactly like a basic string; keep other newlines
checkpoint: 'Multiline basic strings keep newlines and trim the leading one. Commit and stop here.'
---

A **multiline basic string** is delimited by three double quotes `"""` and may span
many lines, which is handy for prose or embedded documents. Inside, the same escapes
as a basic string apply, but real newlines are allowed too and are kept as part of
the value. It reads up to the closing `"""`, and everything between is content.

There is one trimming rule to get right: **a newline immediately following the
opening delimiter is trimmed**. This lets writers put the opening `"""` on its own
line for neatness without that first newline becoming part of the string. So opening
`"""` then a newline then `first` then a newline then `second` then a newline then
`"""` yields `first\nsecond\n` - the leading newline gone, the interior ones kept. A
`\r\n` right after the opener counts as that single trimmed newline. The whole
string may also sit on one line (`"""abc"""` is `abc`). The next lesson adds the
second, subtler trim: a backslash at the end of a line.
