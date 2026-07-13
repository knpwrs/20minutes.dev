---
project: build-a-json-parser
lesson: 7
title: The simple string escapes
overview: A string cannot hold a raw quote or newline, so JSON spells those with backslash escapes. Today you decode the eight single-character escapes into the bytes they stand for.
goal: Decode the eight backslash escapes into their literal characters inside a scanned string.
spec:
  scenario: Decoding backslash escapes
  status: failing
  lines:
    - kw: Given
      text: 'a quoted string containing backslash escapes'
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'the string written as quote, a, backslash, t, b, quote decodes to a, then a tab, then b'
    - kw: And
      text: 'backslash-quote decodes to a double quote, backslash-backslash to a single backslash, and backslash-n to a line feed'
code:
  lang: go
  source: |
    // inside the string loop, when you see '\\', read the next byte:
    //   '"' -> '"'   '\\' -> '\\'   '/' -> '/'
    //   'b' -> 0x08  'f' -> 0x0C   'n' -> '\n'
    //   'r' -> '\r'  't' -> '\t'
    // append the decoded byte to a build buffer, not the raw two bytes
checkpoint: Strings with the eight simple escapes decode correctly. Commit and stop here.
---

Some characters cannot appear literally between quotes: a raw double quote would
end the string early, and control characters like a newline are not allowed inside
one. JSON solves this with **escape sequences** - a backslash followed by one more
character that names the byte to produce. There are eight of these single-character
escapes: `\"`, `\\`, `\/`, `\b`, `\f`, `\n`, `\r`, and `\t`.

The moment you have escapes, you can no longer just slice the input between the
quotes - the decoded value differs from the raw bytes. So build the value into a
buffer instead: copy ordinary characters straight across, and when you hit a
backslash, look at the next byte and append the single character it stands for.
`\b` is backspace (byte `0x08`) and `\f` is form feed (byte `0x0C`); the rest map to
the obvious ASCII characters. Unknown escapes and the `\u` form come in later
lessons.
