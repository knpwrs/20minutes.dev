---
project: build-a-url-parser
lesson: 25
title: 'Capstone: parse, decode, normalize, resolve'
overview: The final lesson runs the whole library on a real URL and a real base - parse a full URL into components, decode its query, normalize it, and resolve several references - proving every layer works together.
goal: Drive the complete library end to end on a real URL and the RFC base.
spec:
  scenario: The full library on real input
  status: failing
  lines:
    - kw: Given
      text: 'the URL "https://User@Example.COM:443/docs/index.html?q=go+lang&p=%2F#top"'
    - kw: When
      text: 'it is parsed, its query is decoded, and it is normalized'
    - kw: Then
      text: 'the parsed Userinfo is "User", Host is "Example.COM", Port is "443", and ParseQuery gives (q, "go lang") and (p, "/")'
    - kw: And
      text: 'after Normalize the Scheme is "https", the Host is "example.com", and HasPort is false (443 is the https default)'
    - kw: And
      text: 'against base "http://a/b/c/d;p?q", resolving "g" gives "http://a/b/c/g", "../g" gives "http://a/b/g", and "../../../g" gives "http://a/g"'
code:
  lang: go
  source: |
    // 1. u := Parse(raw)                 // five components + authority sub-parts
    // 2. ParseQuery(u.Query)             // -> decoded pairs
    // 3. Normalize(u)                    // lowercase host, drop default port
    // 4. Resolve(base, Parse(ref))       // -> absolute URI; .String() to read it
checkpoint: Your URL parser parses, decodes, normalizes, and resolves against a base. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a real, importable **RFC 3986 URI library**. Give it a full URL and it splits out every component - the userinfo `User`, the host `Example.COM`, the port `443`, the path, the query, and the fragment. `ParseQuery` reads the query as parameters, turning `q=go+lang` into the value `go lang` and `p=%2F` into `/`. `Normalize` canonicalizes it - lowercasing the host to `example.com` and dropping the redundant `443` because it is the https default. Every layer you built is doing its job at once.

Then the centerpiece: against the base `http://a/b/c/d;p?q`, the resolver turns relative references into absolute URIs exactly as RFC 3986 prescribes - `g` into `http://a/b/c/g`, `../g` climbing to `http://a/b/g`, and even the over-reaching `../../../g` clamped to `http://a/g`. From a `Parse` that returned a bare path you have built the honest core of a URL library: the same generic-syntax split, percent-coding, normalization, and reference resolution that sit inside every browser and HTTP client, before the scheme-specific and WHATWG web-compatibility layers they add on top. The engine underneath is entirely yours.
