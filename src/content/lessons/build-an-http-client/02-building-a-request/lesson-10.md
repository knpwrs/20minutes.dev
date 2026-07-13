---
project: build-an-http-client
lesson: 10
title: Serialize the header block
overview: Headers go onto the wire as one line each, name colon space value, and the block ends with a blank line. Today you serialize the collection to those exact bytes in a stable order.
goal: Serialize the header collection to lines in sorted name order, ending with a blank line.
spec:
  scenario: Writing the header block
  status: failing
  lines:
    - kw: Given
      text: 'a header collection with Host "example.com" and Accept "text/html" set on it'
    - kw: When
      text: the header block is serialized
    - kw: Then
      text: 'it is exactly "Accept: text/html\r\nHost: example.com\r\n\r\n" (names sorted, each line CRLF, then a blank CRLF)'
    - kw: And
      text: 'an empty header collection serializes to just "\r\n" (the terminating blank line)'
code:
  lang: go
  source: |
    // one line per header: "Name: Value\r\n". emit in SORTED name
    // order so the bytes are deterministic (a map has no order).
    // after the last header, a single blank "\r\n" ends the block.
    // note: the store from last lesson kept only a lowercased key -
    // also remember each name AS IT WAS SET so you can emit that casing.
    func (h *Header) serialize() string {
      // sort names, join "Name: Value\r\n", then append "\r\n"
    }
checkpoint: The header collection serializes to a deterministic, correctly terminated block. Commit and stop here.
---

On the wire each header is one line - the field name, a colon and a space, the
value, then `\r\n` - and the whole block is closed by a **blank line**, an extra
`\r\n` marking the end of the headers. That blank line is what a server (and, in
chapter three, your own parser) watches for to know the headers are done.

There is one trap worth heading off now: a map has **no defined iteration order**,
so serializing headers straight from a map would emit them in a different order
every run and make exact-byte tests flaky. Emit the names in **sorted order**
instead, so the same headers always produce the same bytes. Deterministic output is
what lets every later lesson assert the exact wire form of a request. An empty
collection is just the terminating blank line on its own. One small extension is
needed: last lesson the store only kept a lowercased key, so remember each name **as
it was set** too, and emit that casing here (the wire shows `Host`, not `host`).
