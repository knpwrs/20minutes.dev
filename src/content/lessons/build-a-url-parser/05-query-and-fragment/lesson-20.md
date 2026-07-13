---
project: build-a-url-parser
lesson: 20
title: Form-decoding the pairs
overview: Query values use the HTML form encoding, where a plus sign means a space and each part is percent-decoded. Today you decode the pairs, completing ParseQuery into something you can actually read values out of.
goal: Decode each key and value, treating plus as space and applying percent-decoding.
spec:
  scenario: Decoding query values
  status: failing
  lines:
    - kw: Given
      text: 'the query strings "a=1&b=two+words" and "a=%2F"'
    - kw: When
      text: 'each is parsed and form-decoded'
    - kw: Then
      text: '"a=1&b=two+words" yields (a, 1) and (b, "two words"), with the plus decoded to a space'
    - kw: And
      text: '"a=%2F" yields (a, "/"), the percent-escape decoded'
code:
  lang: go
  source: |
    // form-decode each key and value:
    // 1. replace every '+' with a space
    // 2. percent-decode the result
    func formDecode(s string) string {
      s = strings.ReplaceAll(s, "+", " ")
      // then reuse PercentDecode
    }
checkpoint: ParseQuery now returns fully decoded keys and values. The query chapter is complete - commit and stop here.
---

Query strings that come from HTML forms use the **application/x-www-form-urlencoded** convention, which differs from ordinary percent-decoding in one surprising way: a `+` stands for a space. This is a historical quirk of form submission, not part of RFC 3986's percent-encoding, but it is universal on the web, so `b=two+words` means the value `two words`. Form-decoding a part is therefore two steps: replace every `+` with a space, then percent-decode what remains, so an explicit `%20` also becomes a space and `%2F` becomes a slash.

Apply this to both the key and the value of each pair, so the list `ParseQuery` returns holds real, usable strings. The order of the two steps is deliberate: you swap `+` for space *before* decoding, because a literal plus sign that was meant as data would itself have been encoded as `%2B` and must survive as a `+`. With decoding in place, `ParseQuery` is a complete public entry point - hand it a URI's `Query` field and get back the parameters a program actually wants. The query and fragment components are now fully handled, leaving the centerpiece: resolving references.
