---
project: build-a-toml-parser
lesson: 3
title: Comments and blank lines
overview: 'Real config files are full of comments and spacing. Today you teach the reader to ignore a # comment, whether it is a whole line or trails a value, and to skip blank lines, so several pairs read cleanly into the table in order.'
goal: 'Ignore full-line and end-of-line # comments and parse several pairs in order.'
spec:
  scenario: Comments and multiple pairs
  status: failing
  lines:
    - kw: Given
      text: 'a document with a full-line comment, a blank line, and two pairs a = 1 and b = 2 where the a line ends with a trailing comment'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the table has exactly two entries, a with integer 1 then b with integer 2, in that order'
    - kw: And
      text: 'a comment marker # inside nothing but code strips the rest of the line, so a = 1 # note yields the integer 1'
code:
  lang: go
  source: |
    // for each raw line:
    //   strip a trailing comment: cut at the first '#'  (safe now;
    //     strings that contain # arrive in a later lesson)
    //   trim surrounding whitespace
    //   if the line is now empty, skip it
    //   otherwise split on '=' as before
checkpoint: 'Comments and blank lines are ignored and pairs keep their order. Commit and stop here.'
---

A `#` begins a **comment** that runs to the end of the line, and a **blank line**
separates sections for readability. Neither carries data, so the reader drops both.
A comment can stand on its own line or trail a value (`port = 80  # the http port`),
and in every case everything from the `#` onward is discarded before the line is
interpreted.

For now the whole rest of the line after a `#` can be cut away safely, because the
only values you can parse are integers, which never contain a `#`. That changes once
strings arrive - a `#` inside `"a # b"` is data, not a comment - and a later lesson
sharpens the rule to respect that. Today the job is simpler: strip the comment, skip
the line if nothing is left, and otherwise read the pair. Several pairs in a row land
in the table in the order they appear, which the ordered entry list preserves.
