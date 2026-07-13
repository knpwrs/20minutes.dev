---
project: build-a-csv-parser
lesson: 23
title: Quoting exactly what needs it
overview: A field that contains a comma, a quote, or a newline would corrupt the output if written raw, so the writer must quote it. Today you add minimal quoting, wrapping only the fields that need it and doubling any quotes inside.
goal: Quote a field only when it contains the delimiter, a quote, or a line break, escaping inner quotes by doubling.
spec:
  scenario: Minimal quoting on write
  status: failing
  lines:
    - kw: Given
      text: 'the record ["a,b", he "said"] where the second field is the four words h e, then a quoted said'
    - kw: When
      text: 'it is written'
    - kw: Then
      text: 'each risky field is wrapped in quotes and inner quotes are doubled, giving "a,b","he ""said""" followed by a newline'
    - kw: And
      text: 'a field with a newline is quoted too, so the record ["a\nb"] writes as "a\nb" (wrapped in quotes) then a newline, while a plain field like "plain" is written bare'
code:
  lang: go
  source: |
    // quote a field only if it contains the delimiter, a '"', a '\r', or a '\n'
    func needsQuoting(field string) bool { /* strings.ContainsAny(field, ",\"\r\n") */ }
    // to quote: replace each '"' with '""', then wrap the whole thing in '"' ... '"'
    // otherwise write the field unchanged
checkpoint: The writer quotes exactly the fields that contain a delimiter, quote, or line break. Commit and stop here.
---

Writing plain fields was easy; writing arbitrary fields is where the writer earns its
keep. If a value contains the delimiter, a raw join would split it into two fields on
read. If it contains a newline, it would look like a record boundary. If it contains
a quote, it would confuse the quoting itself. The fix is the write-side of everything
you built into the parser: wrap such a field in double quotes, and double any quote
already inside it so the parser's escape rule decodes it back to a single quote.

The word that matters is **minimal**. You quote a field only when it actually
contains one of the risky characters, the delimiter, a double quote, a carriage
return, or a newline, and you leave every other field bare. This keeps the output
readable and small, matches what people expect a CSV writer to produce, and, crucially,
is the exact inverse of your reader: a field the writer quotes is one the reader will
unquote to the identical value, and a field written bare is one the reader passes
through untouched. Getting the trigger set right, no more and no less than those four
characters, is what makes the round trip in the next lesson hold.
