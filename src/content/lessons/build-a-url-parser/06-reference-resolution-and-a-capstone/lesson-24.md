---
project: build-a-url-parser
lesson: 24
title: The abnormal resolution cases
overview: RFC 3986 also lists abnormal examples - references with too many parent segments or dot-looking characters in odd places - to pin down behavior at the edges. Today you prove your resolver handles them exactly, with no new code beyond what you already built.
goal: Reproduce the RFC 3986 abnormal resolution examples against the same base.
spec:
  scenario: Resolving abnormal references
  status: failing
  lines:
    - kw: Given
      text: 'the base "http://a/b/c/d;p?q"'
    - kw: When
      text: 'an abnormal reference is resolved and recomposed'
    - kw: Then
      text: '"../../../g" gives "http://a/g" and "/./g" gives "http://a/g", the extra parent steps clamped at the root'
    - kw: And
      text: '"g?y/./x" gives "http://a/b/c/g?y/./x" and "g#s/../x" gives "http://a/b/c/g#s/../x", because dot segments in a query or fragment are left untouched'
code:
  lang: go
  source: |
    // No new code: these should already pass from lesson 23.
    // The key facts your resolver already enforces:
    //  - remove_dot_segments never climbs above the root
    //  - only the PATH is dot-cleaned; query and fragment are copied verbatim
checkpoint: Resolve reproduces the abnormal RFC examples too, confirming the algorithm is complete. Commit and stop here.
---

The RFC's **abnormal** examples exist to nail down behavior that a careless implementation gets wrong. The first family has more `..` segments than there are directories to climb: `../../../g` against `http://a/b/c/d;p?q` should not underflow into some invalid path - `remove_dot_segments` clamps it at the root, giving `http://a/g`. Likewise `/./g` cleans to `http://a/g`. If your dot-segment algorithm followed the RFC exactly, these already work; the examples simply confirm it does not run off the top of the tree.

The second family checks a boundary that is easy to blur: dot segments are a **path** concept only. In `g?y/./x`, the `/./` lives inside the query, and the query is copied verbatim during resolution, so the result is `http://a/b/c/g?y/./x` with the `/./` intact - the resolver must not "clean" it. The same holds for `g#s/../x` in the fragment. These pass precisely because your Resolve runs `remove_dot_segments` on the merged path and nothing else, copying the query and fragment straight through. That is the point of an abnormal-case pass: it needs no new code, only proof that the boundaries you drew earlier hold under pressure.
