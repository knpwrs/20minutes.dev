---
project: build-a-toml-parser
lesson: 2
title: A key equals value line
overview: 'The heart of TOML is the line key = value. Today you read one such line, split it at the equals sign, and store the pair in the table, using a plain decimal integer as the first value type so the whole pipeline works end to end.'
goal: 'Parse a single key = value line with a decimal integer into a one-entry table.'
spec:
  scenario: One key/value pair
  status: failing
  lines:
    - kw: Given
      text: 'the input answer = 42'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the table has one entry whose key is answer and whose value is the integer 42'
    - kw: And
      text: 'surrounding spaces do not matter: x=1 and  x  =  1  both give key x with the integer 1'
code:
  lang: go
  source: |
    // for each non-blank line:
    //   split once on the first '=' into keyText and valueText
    //   key   := trimSpace(keyText)      // a bare key for now
    //   value := parseValue(trimSpace(valueText))
    //   append Entry{key, value} to the table
    // parseValue today: strconv.ParseInt(text, 10, 64) -> KindInteger
checkpoint: 'A single key = value line becomes one table entry. Commit and stop here.'
---

A TOML **key/value pair** is written `key = value`, one per line. Parsing it is two
moves: split the line at the first `=`, then make sense of each side. The left side
is the **key** and the right side is the **value**. Whitespace around the `=` and
around each side is insignificant, so trim it before you look at either part.

For the value you need something concrete to store, so start with the simplest type
TOML offers: a **decimal integer**. Read the trimmed right-hand text as a base-10
number and wrap it in a `Value` of `KindInteger`. This gives the library its first
real round trip - text in, a typed value out - and establishes the `parseValue`
step that every later value form plugs into. The key today is a plain **bare key**;
its full character rules and quoted forms come in the next lessons.
