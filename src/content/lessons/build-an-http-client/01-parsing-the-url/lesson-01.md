---
project: build-an-http-client
lesson: 1
title: The scheme
overview: Every request starts from a URL, and the very first thing a client reads off it is the scheme - http or https - which decides how to talk to the far end. Today you build the smallest possible URL parser, one that pulls just the scheme, so the type every later lesson thickens exists from day one.
goal: Parse a URL string into a value whose scheme field holds the lowercased scheme.
spec:
  scenario: Reading the scheme off a URL
  status: failing
  lines:
    - kw: Given
      text: 'the URL string "http://example.com"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the parsed URL has scheme "http"'
    - kw: And
      text: 'parsing "HTTPS://example.com" gives scheme "https" (schemes are lowercased)'
code:
  lang: go
  source: |
    // the whole client will grow around this type
    type URL struct {
      Scheme string
      // Host, Port, Path, Query, Fragment arrive over the next lessons
    }
    // the scheme is everything before the first "://", lowercased
    func Parse(raw string) (*URL, error) {
      // split on "://", lowercase the left half
    }
checkpoint: You can construct a URL value and read its scheme, lowercased. Commit and stop here.
---

A **URL** is the address a client aims at, and its first component is the
**scheme**: the `http` or `https` before the `://`. The scheme is the single most
important thing about a URL because it decides everything downstream - which
default port to use, whether the connection is encrypted, how the request is
framed. So the parser earns its keep by reading the scheme first.

Schemes are **case-insensitive**, so `HTTP`, `Http`, and `http` all mean the same
thing; the convention is to store them lowercased so later comparisons are simple
equality checks. Keep the type small today - a struct with one filled field and
room for the rest. Everything else about the URL arrives one lesson at a time on
top of this.
