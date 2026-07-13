---
project: build-a-url-parser
lesson: 22
title: Merging a relative path onto a base
overview: Resolving a relative reference needs to graft its path onto the base's path, and RFC 3986 defines a precise merge for that. Today you build the merge step in isolation before the full resolver uses it next lesson.
goal: Implement the merge algorithm from RFC 3986 Section 5.2.3.
spec:
  scenario: Merging paths
  status: failing
  lines:
    - kw: Given
      text: 'the base parsed from "http://a/b/c/d;p?q" and the reference path "g"'
    - kw: When
      text: 'the reference path is merged onto the base'
    - kw: Then
      text: 'the merged path is "/b/c/g", the base path with its last segment replaced'
    - kw: And
      text: 'merging "g" onto a base parsed from "http://a" (authority present, empty path) gives "/g"'
code:
  lang: go
  source: |
    // RFC 3986 5.2.3
    func merge(base *URI, refPath string) string {
      if base.HasAuthority && base.Path == "" { return "/" + refPath }
      if i := strings.LastIndexByte(base.Path, '/'); i >= 0 {
        return base.Path[:i+1] + refPath
      }
      return refPath
    }
checkpoint: The merge step grafts a relative path onto a base path. Commit and stop here.
---

When you resolve a relative reference like `g` against `http://a/b/c/d;p?q`, the `g` has to be interpreted relative to the base's **directory**. RFC 3986 Section 5.2.3 defines **merge** for exactly this: it takes the base URI and the reference's path and produces the combined path that the dot-segment cleanup will then tidy up. The common case replaces everything after the base path's last slash with the reference path, so `g` merged onto `/b/c/d;p` gives `/b/c/g` - the reference sits in the same directory as `d;p`.

There is one special case at the top. If the base has an authority but an *empty* path (as in `http://a`), there is no slash to work from, so merge simply prefixes a slash, yielding `/g`. This handles a base that is nothing but a host. Merge is deliberately a small, separate step: keeping it apart from the main resolution logic makes both easier to get right, and next lesson's resolver calls it for exactly the relative-path branch, then runs `remove_dot_segments` on the result to finish the job.
