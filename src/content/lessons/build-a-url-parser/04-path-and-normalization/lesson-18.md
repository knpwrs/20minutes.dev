---
project: build-a-url-parser
lesson: 18
title: Removing the default port
overview: A scheme's default port carries no information, so normalization drops it. Today you finish Normalize by removing a port that equals the scheme's well-known default, completing the three syntax-based normalization rules.
goal: Normalize a URI by removing a port equal to the scheme's default.
spec:
  scenario: Dropping a default port
  status: failing
  lines:
    - kw: Given
      text: 'the input "http://example.com:80/path"'
    - kw: When
      text: 'it is parsed and normalized'
    - kw: Then
      text: 'HasPort becomes false, because 80 is the default port for http'
    - kw: And
      text: 'a non-default "http://example.com:8080/" keeps its port, and "https://example.com:443/" drops it'
code:
  lang: go
  source: |
    // known defaults: http -> "80", https -> "443"
    var defaultPort = map[string]string{"http": "80", "https": "443"}
    // after lowercasing scheme, if Port == defaultPort[scheme], clear it
    // (set HasPort = false, Port = "")
checkpoint: Normalize now drops a redundant default port; syntax-based normalization is complete. Commit and stop here.
---

The last normalization rule is scheme-aware. Every scheme has a **default port** - `80` for `http`, `443` for `https` - and writing that default explicitly (`http://example.com:80/`) is redundant, since a client uses the default when no port is given. Normalization removes a port that equals its scheme's default, so `http://example.com:80/` and `http://example.com/` become the same URI. A non-default port like `8080` is meaningful and stays; `https://example.com:443/` drops its port because 443 is the https default.

This rule needs the normalized scheme, so it runs after case folding - you look the scheme up in a small table of known defaults and clear the port (both `Port` and `HasPort`) when they match. Unlike the earlier rules, this one depends on scheme-specific knowledge the generic syntax does not provide, which is exactly why the RFC calls it *scheme-based* normalization and limits it to schemes whose defaults you actually know. With case, percent-escapes, and default ports all handled, `Normalize` now produces a canonical form - the form you will compare and recompose in the coming chapters.
