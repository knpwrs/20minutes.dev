---
project: build-a-csv-parser
lesson: 24
title: Round-trip equivalence
overview: The real proof that reader and writer are correct is that writing then reading gives back exactly what you started with. Today you assert that round-trip on deliberately messy records, the property that validates the whole library.
goal: Show that parsing the writer's output reproduces the original records exactly.
spec:
  scenario: Write then parse returns the original
  status: failing
  lines:
    - kw: Given
      text: 'the records [["a,b", "he \"said\"", "line1\nline2"], ["plain", "", "trailing "]] mixing embedded delimiters, quotes, newlines, an empty field, and a trailing space'
    - kw: When
      text: 'they are written to text and that text is parsed back'
    - kw: Then
      text: 'the parsed records are deep-equal to the originals, field for field'
    - kw: And
      text: 'the property holds in general, so parsing the writer output of any records reproduces those records under the default dialect'
code:
  lang: go
  source: |
    // the property: Parse(Write(records)) deep-equals records
    // pick records that exercise every writer branch: a delimiter, a quote,
    //   an embedded newline, an empty field, and a significant trailing space
    // an empty field writes bare and reads back as ""; a trailing space is preserved
checkpoint: Writing then parsing reproduces the original records exactly. The library's two halves are proven inverse. Commit and stop here.
---

This is the lesson the whole writer was built for. A reader and a writer are only
trustworthy together if they are exact inverses, and the way to state that is a
**round trip**: take some records, write them to text, parse that text, and demand
the result equals what you started with. If it does, every quoting and escaping
decision on both sides agrees, and you can move data through the library without fear
of corruption. If it does not, the mismatch points straight at the disagreeing rule.

Choose records that push on every branch at once, a field with the delimiter, a field
with a doubled quote, a field with an embedded newline, an empty field, and a field
with a significant trailing space, because a round trip is only as strong as the cases
it exercises. This is a payoff lesson: if the earlier work is right, the property
simply holds and the test needs almost no new code beyond the assertion, which is
exactly the satisfying signal you want. Note that round-trip equality holds under the
**default** dialect; a lossy option like trimming deliberately does not round-trip,
which is why trimming is opt-in and off by default.
