---
project: build-a-url-parser
lesson: 1
title: The URI value and a bare path
overview: Every URI, however complex, decomposes into the same five components. Today you define the result type that holds all five and give the library its public Parse entry point, starting with the simplest input of all - a bare path with nothing else around it.
goal: Define the URI struct with all five components and parse an input that is just a path.
spec:
  scenario: Parsing a bare path
  status: failing
  lines:
    - kw: Given
      text: 'the input string "foo/bar"'
    - kw: When
      text: 'Parse is called on it'
    - kw: Then
      text: 'the result has Path equal to "foo/bar"'
    - kw: And
      text: 'Scheme is empty, HasAuthority is false, HasQuery is false, and HasFragment is false'
code:
  lang: go
  source: |
    // the whole library grows around this one result type
    type URI struct {
      Scheme                   string
      Authority                string
      HasAuthority             bool
      Userinfo                 string
      HasUserinfo              bool
      Host, Port               string
      HasPort                  bool
      Path                     string
      Query                    string
      HasQuery                 bool
      Fragment                 string
      HasFragment              bool
    }
    func Parse(s string) *URI { return &URI{Path: s} }
checkpoint: You have an importable Parse that returns a typed URI whose Path holds the whole input. Commit and stop here.
---

RFC 3986 describes every URI with one **generic syntax**: `scheme://authority/path?query#fragment`. Not every URI has all five parts, but every URI is some subset of exactly these five **components**, always in this order. The parser's whole job is to find the boundaries between them, so the natural shape for the result is a struct with a field per component.

A few of those components can be *absent* rather than merely empty, and that difference will matter later - a URI with no query is not the same as one with an empty query. So alongside the string fields you carry `Has...` booleans for the parts that can be present-but-empty. Define the entire struct now, even though most fields stay zero today; every later lesson fills in one more boundary. Start at the far end of the grammar: an input with no scheme, no `//`, no `?`, and no `#` is nothing but a **path**, so `Parse` sets `Path` to the whole string and leaves the rest empty.
