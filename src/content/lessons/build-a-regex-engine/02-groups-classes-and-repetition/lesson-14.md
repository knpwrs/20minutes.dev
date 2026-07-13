---
project: build-a-regex-engine
lesson: 14
title: Predefined class shorthands
overview: The escapes `\d`, `\w`, `\s` stand for the classes you reach for constantly - digits, word characters, whitespace. Each one desugars into a character class you already match.
goal: Parse `\d`, `\w`, and `\s` into the character classes they abbreviate.
spec:
  scenario: Shorthand escapes expand into character classes
  status: failing
  lines:
    - kw: Given
      text: 'the pattern ''\d'''
    - kw: When
      text: 'Match is called against "a5b"'
    - kw: Then
      text: 'it reports true, and ''\d'' against "abc" reports false'
    - kw: And
      text: 'Match for ''\w'' against "-x-" reports true'
    - kw: And
      text: 'Match for ''\s'' against "a b" reports true, and ''\s'' against "abc" reports false'
code:
  lang: go
  source: |
    // In the parser, a backslash escape becomes a Class:
    //   \d -> [0-9]
    //   \w -> [A-Za-z0-9_]
    //   \s -> space, tab, newline, carriage return
    // Build the same Class node you use for [ ... ].
checkpoint: '`\d`, `\w`, `\s` expand into their character classes. Commit and stop here.'
---

These three shorthands are everywhere in real patterns, and each is just a named
character class: `\d` is `[0-9]`, `\w` is `[A-Za-z0-9_]`, and `\s` is the whitespace
set (space, tab, newline, carriage return). Rather than invent new node kinds, you
**desugar** them - the parser sees `\d` and emits the very `Class` node it would build
for `[0-9]`. From the matcher's point of view there is nothing new to do.

This is your first real taste of desugaring, a technique the rest of the project
leans on hard: express a new surface feature entirely in terms of machinery that
already exists. It keeps the matcher small even as the syntax grows. Tomorrow you
handle the backslash's other job - turning a metacharacter like `.` back into a plain
literal - and it slots into the same "look at the byte after the backslash" branch.
