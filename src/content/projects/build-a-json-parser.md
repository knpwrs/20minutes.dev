---
title: 'Build a JSON Parser'
order: 18
lessons: 33
size: 'Small'
tech: ['Tokenization', 'Recursive descent', 'Serialization']
estMin: 20
desc: 'Parse JSON into a value tree and serialize it back, with exact errors and full round-trips.'
blurb: 'Start with a scanner that reads one token and end with a library that parses text into a value tree, reports errors with exact line and column, serializes back to compact or pretty text, and resolves JSON Pointer paths. Every lesson is one concrete spec with exact tokens, values, output, and error positions: surrogate pairs collapse to one rune, a lone surrogate is rejected, 01 is rejected as a leading zero, a trailing comma fails at its exact position, and deep nesting hits a depth cap.'
overview: |
  Over 33 lessons you build a working JSON library from scratch: a tokenizer that reads the structural punctuators, literals, whitespace, and positions; string scanning with every escape (including surrogate pairs that combine into one rune, and lone surrogates rejected); number scanning across the full grammar (sign, no leading zeros, negative zero, fractions, exponents); a recursive-descent parser that builds a value tree of nulls, booleans, numbers, strings, arrays, and objects to any depth; error reporting that names the exact line and column of a trailing comma, a missing colon, an unterminated string, or trailing garbage; a depth guard; a compact serializer and a configurable pretty-printer proven by round-trip; and a JSON Pointer query layer that resolves paths like /a/b/0.

  By the end you have an importable library whose public API parses text into values, serializes values back to text, and queries them by pointer, all demonstrated by a runnable jq-lite command that reads JSON from a built-in demo string, stdin, or a file, validates it, and pretty-prints it - printing a clear error with its position when the input is invalid.

  This is a teaching-grade JSON library built around the real json.org grammar and the recursive-descent design: it parses and serializes correct JSON exactly and rejects malformed input with precise positions, and it is honest about its limits - numbers are IEEE-754 doubles (so very large integers lose precision), duplicate object keys resolve last-wins, and it targets UTF-8 text rather than every encoding a spec permits. What you finish with is the honest core that production JSON libraries extend with streaming, arbitrary-precision numbers, and richer configuration.
parts:
  - name: 'A scanner for structure'
    count: 5
  - name: 'Scanning strings and numbers'
    count: 7
  - name: 'Recursive-descent parsing'
    count: 5
  - name: 'Errors and limits'
    count: 6
  - name: 'Serializing'
    count: 6
  - name: 'Access, query, and a capstone'
    count: 4
caveats:
  note: 'A complete, well-tested strict-JSON library - a scanner, a recursive-descent parser with positioned errors and a depth guard, a compact serializer, a pretty-printer, round-trip equality, and JSON Pointer resolution - plus a runnable jq-lite CLI that validates and pretty-prints from a file, stdin, or a built-in demo. It is honest about its data model: numbers are IEEE-754 float64 (so very large integers lose precision), negative zero serializes as 0, objects keep insertion order, and duplicate keys resolve last-wins.'
  future:
    - 'Give ParsePointer and Resolve the same typed, positioned errors that Parse already produces, so a bad path reports where it failed'
    - 'Add a streaming or token-at-a-time Decoder for large documents, instead of parsing the whole input into memory at once'
    - 'Handle arbitrary-precision and big-integer numbers so large IDs and money values do not lose precision to float64'
    - 'Grow the jp CLI into a small query tool: multiple pointers per run, JSON Lines input, and compact or raw output modes'
    - 'Add a configurable serializer (sorted keys, escaped non-ASCII, custom indent) and a strict mode that rejects duplicate keys instead of taking the last'
resources:
  - title: 'Introducing JSON'
    author: 'Douglas Crockford'
    url: 'https://www.json.org/json-en.html'
    note: 'The canonical one-page grammar, with the railroad diagrams for value, string, and number that this project scans and parses. Keep it open beside every lesson.'
  - title: 'RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format'
    author: 'T. Bray (Ed.)'
    url: 'https://www.rfc-editor.org/rfc/rfc8259'
    note: 'The interoperability standard: what a conforming parser must accept and reject, the rules for strings, numbers, and duplicate keys, and the guidance on I-JSON that the error and limit chapters follow.'
  - title: 'Crafting Interpreters'
    author: 'Robert Nystrom'
    url: 'https://craftinginterpreters.com/scanning.html'
    note: 'The scanning and recursive-descent chapters explain the tokenizer and parser structure this project mirrors - reading one token at a time, then descending through the grammar to build a tree.'
  - title: 'Parsing JSON is a Minefield'
    author: 'Nicolas Seriot'
    url: 'https://seriot.ch/projects/parsing_json.html'
    note: 'A survey of where real JSON parsers disagree - number edges, deep nesting, surrogate handling, trailing content - and the test corpus that inspired this project to pin the edges, not just the middle.'
  - title: 'RFC 6901: JavaScript Object Notation (JSON) Pointer'
    author: 'P. Bryan, K. Zyp, M. Nottingham'
    url: 'https://www.rfc-editor.org/rfc/rfc6901'
    note: 'The short spec for the /a/b/0 path syntax and its ~0 and ~1 escapes that the query chapter implements exactly.'
---
