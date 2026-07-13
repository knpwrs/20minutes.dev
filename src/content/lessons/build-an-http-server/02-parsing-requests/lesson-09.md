---
project: build-an-http-server
lesson: 9
title: Collect headers into a map
overview: A request usually carries several headers, so today you parse each line of the header block and gather them into a lookup by name, the structure handlers will read from.
goal: Parse every header line in the head into a map from name to value.
spec:
  scenario: Building the header map
  status: failing
  lines:
    - kw: Given
      text: 'the header lines "Host: example.com" and "Accept: */*"'
    - kw: When
      text: they are collected and looked up by name
    - kw: Then
      text: 'looking up "Host" gives "example.com" and "Accept" gives "*/*"'
    - kw: And
      text: looking up a name that was not sent gives the empty string
code:
  lang: go
  source: |
    type Headers map[string]string
    func (h Headers) Get(name string) string { return h[name] } // exact match, for now
    // build it by running each header line through parseHeader and storing the result
checkpoint: 'A request''s headers collect into a lookup, with absent names reading empty. Commit.'
---

With one header line parsed, the whole block is a loop: run every line after the
request line through `parseHeader` and store the results in a `Headers` map with
a `Get` accessor. That `Get` is how the rest of the server asks questions like
"what is the `Content-Length`?" or "which `Host` was requested?" — and an absent
header simply reads back as empty.

Keep the request line out of this — it was already parsed separately. You are
folding just the header lines from the head into a name-to-value map, one entry
per field.
