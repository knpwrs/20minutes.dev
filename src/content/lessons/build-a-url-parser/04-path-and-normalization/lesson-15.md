---
project: build-a-url-parser
lesson: 15
title: The remove_dot_segments algorithm
overview: Paths accumulate dot segments - the . and .. that mean here and up-one-level - and RFC 3986 defines an exact algorithm to resolve them away. Today you implement remove_dot_segments, the workhorse that reference resolution depends on.
goal: Implement remove_dot_segments exactly as RFC 3986 Section 5.2.4 specifies.
spec:
  scenario: Resolving dot segments
  status: failing
  lines:
    - kw: Given
      text: 'the paths "/a/b/../c", "/a/b/c/./../../g", and "mid/content=5/../6"'
    - kw: When
      text: 'remove_dot_segments is run on each'
    - kw: Then
      text: '"/a/b/../c" becomes "/a/c", "/a/b/c/./../../g" becomes "/a/g", and "mid/content=5/../6" becomes "mid/6"'
    - kw: And
      text: 'a leading "../a" becomes "a", since there is no earlier segment to remove'
code:
  lang: go
  source: |
    // RFC 3986 5.2.4: consume the input buffer, moving whole
    // segments to the output; "./" and "../" prefixes are dropped,
    // "/./" -> "/", "/../" -> "/" AND pop the last output segment.
    func RemoveDotSegments(path string) string { /* the loop */ }
checkpoint: remove_dot_segments resolves any path exactly as the RFC prescribes. Commit and stop here.
---

A path can contain **dot segments**: `.` means "this directory" and `..` means "the parent". `/a/b/../c` should collapse to `/a/c` - the `..` cancels the `b`. RFC 3986 Section 5.2.4 gives a precise, iterative algorithm called **remove_dot_segments** so that every implementation agrees on the result. It works on the whole path as an input buffer, repeatedly matching a prefix and moving text to an output buffer: a leading `./` or `../` is discarded, `/./` (or a trailing `/.`) becomes `/`, and `/../` (or `/..`) becomes `/` while also removing the last segment already written to the output.

The two rules that do real work are the `..` cases, because they reach *backwards* and delete the previous output segment - that is how a parent reference climbs the tree. The algorithm is fiddly precisely so the edges are unambiguous: a leading `../` with nothing before it (`../a`) simply drops the `..` and yields `a`, never underflowing past the root. Follow the RFC's prefix cases in order and the tricky inputs fall out correctly. This function is the beating heart of the resolver two chapters from now, and it is worth getting exactly right on its own today.
