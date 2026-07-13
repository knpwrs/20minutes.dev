---
project: build-a-url-parser
lesson: 13
title: Reserved characters and per-component encoding
overview: Different components allow different characters to appear literally, so a one-size encoder over-escapes. Today you introduce the reserved set and a component-aware encoder, using the path segment - where a colon and sub-delimiters are fine but a slash is not - as the concrete case.
goal: Encode against a component's allowed set, keeping its permitted extras literal.
spec:
  scenario: Encoding a path segment
  status: failing
  lines:
    - kw: Given
      text: 'the strings "a b:c@d" and "a/b"'
    - kw: When
      text: 'each is encoded as a path segment'
    - kw: Then
      text: '"a b:c@d" becomes "a%20b:c@d", keeping the colon and at-sign literal'
    - kw: And
      text: '"a/b" becomes "a%2Fb", because a slash is a segment delimiter and must be escaped inside a segment'
code:
  lang: go
  source: |
    // sub-delims = ! $ & ' ( ) * + , ; =
    // a path segment (pchar) also allows ':' and '@'
    const subDelims = "!$&'()*+,;="
    func encode(s, allowed string) string { /* unreserved OR in allowed -> literal */ }
    func EncodePathSegment(s string) string { return encode(s, subDelims+":@") }
checkpoint: You can encode a string for a specific component, keeping that component's allowed characters literal. Commit and stop here.
---

Beyond the unreserved set, RFC 3986 defines the **reserved** characters, split into two groups: the **gen-delims** (`: / ? # [ ] @`) that separate the major components, and the **sub-delims** (`! $ & ' ( ) * + , ; =`) used within components. Reserved characters have meaning as delimiters, so whether one may appear literally depends on *which* component it is in. A slash is fine in a path (it separates segments) but must be escaped if it is data inside a single segment; a `?` is fine in a query but marks the query's start elsewhere.

That is why a maximal encoder over-escapes: it turns a perfectly legal colon in a path into `%3A`. The fix is a component-aware encoder that takes the extra set a given component permits. A **path segment** allows the unreserved set plus the sub-delims plus `:` and `@` (together these are the RFC's `pchar`), so `a b:c@d` keeps its colon and at-sign and only escapes the space. But a literal slash inside a segment still becomes `%2F`, because a raw slash would split the segment in two. Passing the allowed set as a parameter lets one `encode` function serve every component - query, fragment, userinfo - each with its own permitted extras.
