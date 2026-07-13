---
project: build-a-csv-parser
lesson: 22
title: Writing records back out
overview: A CSV library is only half done if it cannot write. Today you build the writer's core, turning a table of records back into text by joining fields with the delimiter and ending each record with a newline.
goal: Serialize a table of plain records to CSV text with comma delimiters and newline terminators.
spec:
  scenario: Writing plain records
  status: failing
  lines:
    - kw: Given
      text: 'the records [["a", "b"], ["c", "d"]]'
    - kw: When
      text: 'they are written to CSV text'
    - kw: Then
      text: 'the output is exactly "a,b\nc,d\n", with fields joined by commas and each record ended by a newline'
    - kw: And
      text: 'a single record [["x"]] writes as "x\n", so every record, including the last, ends in a newline'
code:
  lang: go
  source: |
    // join each record's fields with the delimiter, terminate each record with '\n'
    func Write(records [][]string) string {
      // for each record: strings.Join(fields, ",") + "\n"
      // (quoting comes next lesson; assume plain fields today)
    }
checkpoint: The writer turns a table of plain records into CSV text. Commit and stop here.
---

Reading and writing are two directions of the same format, and now that the reader is
complete you build its mirror. The writer's core is almost trivial for plain data:
join each record's fields with the delimiter and end each record with a line
terminator. Choose the newline as the default terminator, which keeps the output
compact and makes it round-trip cleanly with your parser; the RFC prefers a carriage
return plus newline, and offering that as a dialect option is a natural extension
later.

The one decision to make deliberately is that **every** record, including the last,
ends with a terminator. That means the output of a single record is `x` followed by a
newline, not a bare `x`. Terminating every record is what lets your parser read the
result back without a special case for the final line, and it matches the earlier
rule that a trailing newline does not create a phantom empty record. Keep today's
writer assuming plain fields with no commas, quotes, or newlines in them; the next
lesson adds the quoting that makes the writer safe for any content, and the lesson
after proves the two directions are exact inverses.
