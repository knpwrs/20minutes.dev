---
project: build-a-json-parser
lesson: 6
title: Scanning a basic string
overview: Strings are where JSON stops being pure punctuation and starts carrying data. Today you scan a quoted string with no escapes into a token that holds its decoded text.
goal: Scan a double-quoted run of plain characters into a String token carrying its contents.
spec:
  scenario: Reading a plain quoted string
  status: failing
  lines:
    - kw: Given
      text: 'the input consisting of the three characters quote, a, b, c, quote'
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'it yields a String token whose value is abc, followed by EOF'
    - kw: And
      text: 'an empty quoted string yields a String token whose value is the empty string'
code:
  lang: go
  source: |
    // add String to Kind; give Token a Str field for the decoded value
    // on seeing '"', consume characters until the closing '"'
    // for now assume no backslashes and a closing quote is present
    //   start := i+1; scan to next '"'; Str = input[start:i]
checkpoint: The scanner reads plain double-quoted strings into String tokens. Commit and stop here.
---

A JSON **string** is a run of characters wrapped in double quotes. The opening
quote tells the scanner "a string starts here"; it then reads forward until the
closing quote, and the bytes in between are the string's value. The quotes
themselves are delimiters, not part of the value, so `"abc"` carries `abc` and `""`
carries the empty string.

Today deliberately handles only the simple case: no backslash escapes, and a
closing quote that is really there. That keeps the lesson to one idea - delimit and
capture the contents - and gives you a `Str` field on the token to hold the decoded
text. The next lessons layer in escapes, Unicode, and the error when the closing
quote never comes. Assume a well-formed simple string for now.
