---
project: build-an-http-server
lesson: 11
title: Fold duplicate headers
overview: A client may send the same header name more than once, and HTTP says those repeats combine into one comma-separated value. Today you fold duplicates instead of letting a later line silently overwrite an earlier one.
goal: Combine repeated header fields of the same name into a single comma-separated value.
spec:
  scenario: Two headers with the same name
  status: failing
  lines:
    - kw: Given
      text: 'the header lines "Accept: text/html" and "Accept: application/json"'
    - kw: When
      text: they are collected
    - kw: Then
      text: 'looking up "Accept" gives "text/html, application/json"'
code:
  lang: go
  source: |
    key := strings.ToLower(name)
    if existing, ok := h[key]; ok {
        h[key] = existing + ", " + value // append, do not overwrite
    } else {
        h[key] = value
    }
checkpoint: 'Repeated headers fold into one comma-separated value. Commit.'
---

Header fields can legitimately repeat. The spec says a recipient **may** combine
multiple fields of the same name into one value by joining them with commas, in
the order they arrived — and for most headers that is exactly equivalent to
having sent one comma-separated value.

The trap is the naive `map[key] = value`, which throws away every value but the
last. Instead, check whether the key already exists and append with `", "` when
it does. Order matters, so always append the newcomer to the end.
