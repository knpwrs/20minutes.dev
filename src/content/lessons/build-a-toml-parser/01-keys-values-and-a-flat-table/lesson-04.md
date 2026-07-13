---
project: build-a-toml-parser
lesson: 4
title: Whitespace and newlines
overview: 'TOML is precise about what counts as whitespace and what ends a line. Today you pin those rules: spaces and tabs are the only insignificant whitespace, and a line ends with either a bare newline or a carriage-return newline pair.'
goal: 'Treat spaces and tabs as whitespace and accept both LF and CRLF line endings.'
spec:
  scenario: Tabs and carriage returns
  status: failing
  lines:
    - kw: Given
      text: 'the input where a tab surrounds the equals sign, written as key<TAB>=<TAB>1'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the table has one entry key with the integer 1'
    - kw: And
      text: 'a document whose lines are separated by carriage-return line-feed pairs parses the same as one separated by line feeds: a = 1 then b = 2 gives two entries in order'
code:
  lang: go
  source: |
    // whitespace = space (0x20) and tab (0x09) only
    // normalize line endings: treat "\r\n" as a line break just like "\n"
    //   e.g. split on "\n" then trim a trailing "\r" from each line
    // then trim leading/trailing spaces and tabs from keys and values
checkpoint: 'Tabs and CRLF line endings parse just like spaces and LF. Commit and stop here.'
---

TOML defines **whitespace** narrowly: only a space (`0x20`) and a horizontal tab
(`0x09`) count, and they are insignificant except inside strings. So a pair may be
written `key = 1`, `key=1`, or `key\t=\t1` with a tab, and all mean the same thing.
Trimming spaces and tabs from each side of the `=` handles every spacing a writer
might use.

Lines end with a **newline**, and TOML accepts two spellings: a lone line feed
(`\n`, the Unix convention) and a carriage-return line-feed pair (`\r\n`, the
Windows convention). A file written on either platform must parse identically, so
normalize the ending: split on `\n` and strip a trailing `\r` from each line before
interpreting it. Getting this right now means every later lesson can assume clean,
platform-independent lines without thinking about it again.
