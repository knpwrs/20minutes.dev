---
project: build-a-csv-parser
lesson: 5
title: A quoted field spans newlines
overview: Because a quoted field takes every character literally, a newline inside the quotes belongs to the field rather than ending the record. Today you confirm one record can span several physical lines, the feature that lets a CSV cell hold a paragraph.
goal: Keep a newline inside a quoted field as part of the value, so the record does not end there.
spec:
  scenario: An embedded newline inside quotes
  status: failing
  lines:
    - kw: Given
      text: 'the input where the first field is the quoted text a newline b, followed by a comma and the plain field c, that is the raw characters quote a newline b quote comma c'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is exactly one record with two fields, ["a\nb", "c"], where the first field contains a literal newline'
    - kw: And
      text: 'the embedded newline does not start a new record (the table has length one), and after a multi-line quoted field a normal record still parses, so "a\nb\nc",d then a newline then e,f parses to [["a\nb\nc", "d"], ["e", "f"]] with length two'
code:
  lang: go
  source: |
    // in QUOTED mode a '\n' is an ordinary character, appended to the field
    // only an UNQUOTED newline flushes the record (the rule from lesson 3)
    // so the record-flush check must ask: am I inside quotes right now?
    //   if quoted -> append the newline; if not -> flush the record
checkpoint: A quoted field can contain a newline, so one record can span several lines. Commit and stop here.
---

The newline is the record separator, but only when it is **outside** a quoted
field. Inside quotes, every character is literal, and a newline is no exception, so
a quoted field can contain a line break and the record simply continues past it.
This is the feature that lets a single cell hold a multi-line note or an address
block, and it is the reason you cannot count a file's records just by counting its
newlines. The number of rows depends on the quoting state at each newline.

The change is small because your state machine already tracks whether it is inside
quotes: the only thing that decides whether a newline flushes the record or joins
the field is that one piece of state. When quoted, append it; when not, flush. Test
the interaction directly by checking that an input with an embedded newline still
produces exactly one record, not two. This is where the earlier record-splitting
rule and the new quoting rule meet, and getting their interaction right is the whole
point of building a state machine rather than splitting on newlines first and commas
second.
