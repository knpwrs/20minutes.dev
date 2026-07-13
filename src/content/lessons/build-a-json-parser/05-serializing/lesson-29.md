---
project: build-a-json-parser
lesson: 29
title: A pretty-printer
overview: Compact output is great for machines and painful for humans. Today you add a pretty-printer that indents nested structure with a configurable unit, turning a value tree into readable, multi-line JSON.
goal: Serialize a value with newlines and a configurable indent, keeping empty containers on one line.
spec:
  scenario: Indented output
  status: failing
  lines:
    - kw: Given
      text: 'the value parsed from {"a":[1,2]} and a two-space indent unit'
    - kw: When
      text: 'Pretty is called'
    - kw: Then
      text: 'the result is exactly (with \n meaning a newline): {\n  "a": [\n    1,\n    2\n  ]\n}'
    - kw: And
      text: 'an empty array serializes as [] and an empty object as {} on a single line, and a key is followed by a colon then one space'
code:
  lang: go
  source: |
    // Pretty(v Value, indent string) string, tracking a current prefix
    //   scalars: same text as Serialize
    //   empty array/object: "[]" / "{}" (no newlines)
    //   array: "[\n" + each elem at prefix+indent, ",\n" between,
    //          then "\n" + prefix + "]"
    //   object: like array but each member is
    //          prefix+indent + key + ": " + Pretty(value)
checkpoint: Values pretty-print with configurable indentation. Commit and stop here.
---

The compact form is deliberately dense; a **pretty-printer** trades bytes for
readability by putting each element or member on its own line and indenting to show
nesting. The indent unit is configurable - two spaces, four, a tab - and each level
of nesting adds one more unit of it. A key is followed by a colon and a single
space, so members read like `"a": value`.

The one rule that keeps output tidy is that **empty containers stay on one line**:
an empty array is `[]` and an empty object `{}`, never split across lines. Everything
else opens its bracket, drops to indented lines for its children with commas ending
each line but the last, and closes the bracket back at the parent's indent level.
Track the current indentation as you recurse and prepend it to each child line. This
is the last piece of output the library needs; from here the project turns to
querying the tree you can now build and print.
