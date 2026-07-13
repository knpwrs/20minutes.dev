---
project: build-an-http-client
lesson: 18
title: Repeated header fields
overview: A server may send the same header name more than once, and the rule is to combine them into one comma-joined value. Today you make the header collection accumulate repeats instead of overwriting them.
goal: Combine repeated header fields parsed from a response into a single comma-joined value.
spec:
  scenario: Two headers with the same name
  status: failing
  lines:
    - kw: Given
      text: 'a reader positioned at "Cache-Control: no-cache\r\nCache-Control: no-store\r\n\r\n"'
    - kw: When
      text: the header block is parsed
    - kw: Then
      text: 'Get("Cache-Control") is "no-cache, no-store" - the two fields are combined in order, joined by a comma and a space'
    - kw: And
      text: 'a header name that appears only once is returned unchanged, e.g. a lone "Accept: text/html" gives "text/html"'
code:
  lang: go
  source: |
    // parsing a header adds to the value rather than replacing it:
    // when a name is already present, append the new value joined by
    // ", ". give the Header an Add (accumulate) distinct from Set
    // (overwrite), and have parseHeaders use Add.
    func (h *Header) Add(name, value string) {
      // if present: existing + ", " + value; else: set value
    }
checkpoint: Repeated response headers combine into one comma-joined value. Commit and stop here.
---

HTTP allows a header field to appear **more than once**, and the standard says a
recipient combines the repeats into one value by joining them **in order with a
comma and a space**. So a response carrying `Cache-Control: no-cache` and then
`Cache-Control: no-store` is read as the single value `no-cache, no-store` - exactly
as if the server had sent them on one line. Your parser has to accumulate repeats
rather than let the second overwrite the first.

The clean way is to give the header collection an **Add** that appends (joining with
`, ` when the name already exists), distinct from the **Set** the request side uses
to overwrite. Response parsing switches to `Add`; a name seen once behaves exactly as
before. One field is the notable exception to comma-joining - `Set-Cookie`, whose
values can themselves contain commas - which is why chapter six parses each
`Set-Cookie` on its own rather than through this combined value.
