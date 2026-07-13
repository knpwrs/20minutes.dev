---
project: build-an-http-client
lesson: 9
title: A header collection
overview: Requests and responses both carry headers - named fields whose names are case-insensitive. Today you build the header collection with a case-insensitive lookup, the container both directions of the client will use.
goal: Build a header collection whose Get looks up names case-insensitively while Set records the value.
spec:
  scenario: Case-insensitive header lookup
  status: failing
  lines:
    - kw: Given
      text: 'a header collection with Set("Content-Type", "text/html") called on it'
    - kw: When
      text: 'Get is called'
    - kw: Then
      text: 'Get("Content-Type"), Get("content-type"), and Get("CONTENT-TYPE") all return "text/html"'
    - kw: And
      text: 'Get on a name that was never set returns "" (empty)'
code:
  lang: go
  source: |
    // header names are case-insensitive. store under a canonical key
    // (e.g. lowercased) so lookups match regardless of the caller's case.
    type Header struct { /* map from canonical name to value */ }
    func (h *Header) Set(name, value string) { /* key by canonical(name) */ }
    func (h *Header) Get(name string) string { /* look up canonical(name) */ }
checkpoint: You have a header collection with case-insensitive Get and Set. Commit and stop here.
---

HTTP **header field names are case-insensitive**: `Content-Type`, `content-type`,
and `CONTENT-TYPE` are the same field. A server may send `Content-Length` while your
code asks for `content-length`, and both must agree. The clean way to guarantee
that is to store each header under a **canonical key** - lowercasing the name works
- so a lookup normalizes the same way and always matches.

This collection is the container both halves of the client lean on: chapter two
sets request headers into it, chapter three parses response headers into the same
shape. Keep it simple today - one value per name, case-insensitive lookup, empty
string for a missing name. Preserving the original casing for output and handling
repeated names are refinements the later lessons add when they need them.
