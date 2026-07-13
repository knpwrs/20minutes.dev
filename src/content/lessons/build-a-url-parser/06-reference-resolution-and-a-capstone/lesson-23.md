---
project: build-a-url-parser
lesson: 23
title: Resolving a reference, the normal cases
overview: This is the centerpiece - the RFC 3986 Section 5.2.2 algorithm that turns a relative reference against a base into an absolute URI. Today you implement it and pin the normal examples straight from the specification's own table.
goal: Implement transform_references and reproduce the RFC 3986 normal resolution examples.
spec:
  scenario: Resolving normal references
  status: failing
  lines:
    - kw: Given
      text: 'the base "http://a/b/c/d;p?q"'
    - kw: When
      text: 'a reference is resolved against it and recomposed'
    - kw: Then
      text: '"g" gives "http://a/b/c/g", "../g" gives "http://a/b/g", "/g" gives "http://a/g", and "//g" gives "http://g"'
    - kw: And
      text: '"?y" gives "http://a/b/c/d;p?y", "#s" gives "http://a/b/c/d;p?q#s", and the empty reference "" gives back "http://a/b/c/d;p?q"'
code:
  lang: go
  source: |
    // RFC 3986 5.2.2 (strict). Choose the target's components by case:
    //   ref has scheme        -> use ref's scheme/authority/path/query
    //   ref has authority     -> keep base scheme, take ref authority/path/query
    //   ref path empty        -> keep base path; query = ref's if present else base's
    //   ref path absolute     -> remove_dot_segments(ref path)
    //   else                  -> remove_dot_segments(merge(base, ref path))
    // fragment is ALWAYS the reference's.
    func Resolve(base, ref *URI) *URI { /* ... */ }
checkpoint: Resolve turns a relative reference into an absolute URI for the normal cases. Commit and stop here.
---

Reference resolution is what a browser does every time a page links to `../images/logo.png`: it combines a relative **reference** with the **base** URI of the current document to get an absolute URI. RFC 3986 Section 5.2.2 gives the exact algorithm as a cascade of cases on the reference. If the reference has its own scheme it is already absolute and wins outright. Otherwise the base's scheme is kept, and the choice narrows: a reference with an authority replaces the base's authority and path; a reference with an empty path keeps the base's path (and its query, unless the reference brought one); an absolute reference path replaces the base's path; and a relative reference path is *merged* onto the base and cleaned with `remove_dot_segments`. The fragment always comes from the reference.

The magic is that this handful of cases reproduces the specification's entire example table exactly. Against `http://a/b/c/d;p?q`, `g` resolves to `http://a/b/c/g`, `../g` climbs one directory to `http://a/b/g`, `/g` replaces the whole path to give `http://a/g`, and `//g` swaps the authority for `http://g`. The degenerate references are just as precise: `?y` keeps the path and swaps the query, `#s` keeps everything and adds a fragment, and the empty reference `""` resolves right back to the base. Follow the case order in the RFC and every one of these falls out; assert them against the spec's own values and you know your resolver is correct.
