---
project: build-an-http-client
lesson: 36
title: Resolve the Location
overview: A redirect's Location is often a relative path, not a full URL. Today you resolve it against the current URL so the client always ends up with an absolute target to dial.
goal: Resolve a Location against the current URL, handling both absolute URLs and absolute-path references.
spec:
  scenario: Resolving a redirect target
  status: failing
  lines:
    - kw: Given
      text: 'the current URL "http://example.com/a/b" and a Location of "/new"'
    - kw: When
      text: the Location is resolved
    - kw: Then
      text: 'the resolved URL is "http://example.com/new" (an absolute-path Location keeps the current scheme, host, and port)'
    - kw: And
      text: 'a Location that is already absolute, "http://other.com/x", resolves to itself unchanged'
code:
  lang: go
  source: |
    // if the Location has a scheme ("http://"...), it is absolute:
    // parse and use it as-is. otherwise, if it starts with "/", it
    // is an absolute path: keep the current scheme+host+port, replace
    // the path (and query) with the Location.
    func resolveLocation(current *URL, location string) *URL { /* ... */ }
checkpoint: The client resolves a Location to an absolute URL to follow. Commit and stop here.
---

The `Location` header may be a **full URL** (`http://other.com/x`) or a **relative
reference** - most commonly an absolute path like `/new`. A client has to turn
whichever it gets into a concrete absolute URL it can connect to. If the Location
already has a scheme, it is absolute and you just parse it. If it starts with `/`, it
is an absolute path on the *same server*, so you keep the current URL's scheme, host,
and port and swap in the new path.

Full relative-reference resolution (`../`, paths relative to the current directory)
is a corner of the URI standard we deliberately skip - absolute URLs and absolute
paths cover the overwhelming majority of real redirects, and stopping there keeps the
lesson to one clear idea. With the target resolved, the last redirect question is
whether to reuse the original method, which is next.
