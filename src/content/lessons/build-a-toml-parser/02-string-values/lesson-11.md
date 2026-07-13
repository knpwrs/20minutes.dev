---
project: build-a-toml-parser
lesson: 11
title: The line-ending backslash
overview: 'Multiline strings have one more escape, unique to them: a backslash at the end of a line. Today you implement that trim, which lets a long value be written across neat lines while parsing to a single unbroken string.'
goal: 'Trim the newline and following whitespace after a line-ending backslash.'
spec:
  scenario: Line-ending backslash trimming
  status: failing
  lines:
    - kw: Given
      text: 'a multiline basic string whose content is backslash, newline, spaces, The quick, space, backslash, newline, spaces, brown fox'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the value is exactly The quick brown fox, with each backslash plus the newline and following whitespace removed'
    - kw: And
      text: 'the trim only applies when the backslash is the last non-whitespace character on the line inside a multiline string'
code:
  lang: go
  source: |
    // inside a multiline basic string, when a '\' is followed only by
    // whitespace to the end of the line:
    //   drop the backslash, the newline, and ALL leading whitespace
    //   (spaces, tabs, newlines) of the following line(s)
    // a '\' followed by a real character is an ordinary escape
checkpoint: 'A line-ending backslash folds the following whitespace away. Commit and stop here.'
---

Multiline basic strings add one escape the single-line form does not have: a
**backslash at the end of a line**. When a `\` is the last non-whitespace character
on a line, TOML removes the backslash, the newline after it, and **all leading
whitespace** of the next line - including further blank lines - until it reaches the
next non-whitespace character. This lets a writer break a long value across tidy,
indented lines while the parsed value has no line breaks at all.

So a string whose content is `\` then a newline then `  The quick ` then `\` then a
newline then `  brown fox` folds down to `The quick brown fox`: each trailing
backslash swallows the newline and the indentation that follows. The distinction to
respect is placement - a backslash followed by a real character (`\n`, `\t`) is an
ordinary escape from the previous lessons, while a backslash followed only by
whitespace-then-newline is this line-continuation trim. This is the classic edge the
TOML spec calls out, and pinning it makes long embedded text behave.
