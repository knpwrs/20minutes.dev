---
project: build-a-json-parser
lesson: 33
title: 'Capstone: a document parsed, queried, and printed'
overview: The final lesson runs the whole library on a real multi-line document - parse it, resolve several pointers into it, and serialize it back - proving every layer works together.
goal: Parse a multi-line document, resolve pointers into it, and serialize it exactly.
spec:
  scenario: The full library on a real document
  status: failing
  lines:
    - kw: Given
      text: 'the multi-line document {"name":"20minutes","version":3,"tags":["json","parser"],"meta":{"nested":{"deep":true}}} written across several indented lines'
    - kw: When
      text: 'it is parsed, then queried and re-serialized'
    - kw: Then
      text: 'Resolve "/name" is String "20minutes", Resolve "/tags/1" is String "parser", Resolve "/meta/nested/deep" is Bool true, and Resolve "/version" is Number 3'
    - kw: And
      text: 'Serialize of the parsed document is exactly {"name":"20minutes","version":3,"tags":["json","parser"],"meta":{"nested":{"deep":true}}}'
code:
  lang: go
  source: |
    // 1. doc, err := Parse(source)         // multi-line input, err is nil
    // 2. Resolve(doc, "/meta/nested/deep")  // -> Bool true
    // 3. Serialize(doc)                      // -> compact canonical text
    // 4. Pretty(doc, "  ")                   // -> the readable indented form
checkpoint: Your JSON library parses, queries, and serializes a real document. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a real, importable **JSON
library**. Give it a document spread across many lines with nested objects and
arrays, and it parses the text into a value tree, ignoring the insignificant
whitespace; resolves JSON Pointers like `/meta/nested/deep` straight to the value
they name; and serializes the tree back to compact canonical text or, with `Pretty`,
to a readable indented form. Every layer is doing its job at once.

The scanner turned bytes into tokens with positions, the recursive-descent parser
built the tree and would have named the exact spot of any error, the serializer wrote
it back, and JSON Pointer reached inside it. From a scanner that read a single EOF
token you have built the honest core of a JSON library - the same design that sits
inside the tools you use every day, minus the streaming, arbitrary-precision numbers,
and configuration they layer on top. The finalize pass wraps this in a small jq-lite
command so you can pretty-print any file from the shell; the engine underneath is
entirely yours.
