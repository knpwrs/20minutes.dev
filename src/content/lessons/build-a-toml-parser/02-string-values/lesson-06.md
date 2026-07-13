---
project: build-a-toml-parser
lesson: 6
title: Basic strings
overview: 'Strings are the most common TOML value. Today you parse a basic string, the double-quoted form, reading the characters between the quotes, and you fix comment handling so a # inside a string is kept, not cut.'
goal: 'Parse a double-quoted basic string into a string value.'
spec:
  scenario: A double-quoted string
  status: failing
  lines:
    - kw: Given
      text: 'the pair name = "TOML"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the value for name is the string TOML'
    - kw: And
      text: 'an empty string "" is the empty string, and a # inside a string is kept, so note = "a # b" is the string a # b'
code:
  lang: go
  source: |
    // parseValue dispatches on the first character of the trimmed value:
    //   '"' -> read a basic string: consume chars until the closing '"'
    //   digit/sign -> the integer path from before
    // read the value FIRST, then whatever follows (spaces + optional
    // #comment) is trailing - so a '#' inside the quotes is not a comment
checkpoint: 'Double-quoted basic strings parse, and a # inside them is safe. Commit and stop here.'
---

A **basic string** is written in double quotes: `"TOML"`. Parsing it means reading
the characters between the opening and closing `"` and storing them as a
`KindString` value. The empty string `""` is perfectly valid and holds no
characters. This is where `parseValue` becomes a real dispatch: it looks at the
first character of the value and branches - a `"` starts a string, a digit or sign
starts a number.

Strings also force a fix to comment handling. Earlier you cut everything after the
first `#` on a line, which was safe when values were only integers. But `"a # b"` is
a string whose content includes a `#`, and cutting there would corrupt it. The
correct order is to **read the value first** - consuming the whole quoted string,
`#` and all - and only then treat the remainder of the line (optional whitespace and
an optional `#` comment) as trailing. From now on, comments are recognized around
values, not by blindly slicing the raw line.
