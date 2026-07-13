---
project: build-a-json-parser
lesson: 23
title: A depth guard
overview: Recursive descent recurses as deep as the input nests, so a pathologically nested document could exhaust the stack. Today you add a configurable depth limit that rejects over-deep nesting with a clear error instead of crashing.
goal: Reject nesting beyond a configurable maximum depth with a positioned error.
spec:
  scenario: Nesting past the limit
  status: failing
  lines:
    - kw: Given
      text: 'a maximum nesting depth of 3'
    - kw: When
      text: 'the input is parsed with that limit'
    - kw: Then
      text: 'ParseWith("[[[1]]]", 3) succeeds with the nested Array value'
    - kw: And
      text: 'ParseWith("[[[[1]]]]", 3) gives "maximum nesting depth exceeded at line 1, column 4"'
code:
  lang: go
  source: |
    // thread a depth counter through the container parsers:
    //   entering an array or object: depth++
    //   if depth > maxDepth: ParseError at the opening bracket/brace
    //   leaving it: depth--
    // Parse(input) calls ParseWith(input, 128); ParseWith exposes the cap
checkpoint: Over-deep nesting is rejected with a clear error. Commit and stop here.
---

Because `parseValue` calls itself for every nested container, a document like a
thousand stacked brackets would recurse a thousand frames deep and could overflow
the call stack - a classic denial-of-service against naive parsers. The defense is a
**depth guard**: count how many containers are currently open, and refuse to go
deeper than a configured maximum, reporting a clean error rather than letting the
runtime crash.

Thread a depth counter through the array and object parsers: increment when entering
a container, check it against the limit, and decrement on the way out. When the
limit is exceeded, produce a `ParseError` at the bracket or brace that crossed the
line. Expose the cap through a `ParseWith(input, maxDepth)` entry point and have the
plain `Parse` call it with a sensible default like `128`. Pin the boundary exactly:
nesting right at the limit still parses, and one level past it is the error. That
completes the parser - it now accepts every valid document and rejects every invalid
one with a precise, safe message.
