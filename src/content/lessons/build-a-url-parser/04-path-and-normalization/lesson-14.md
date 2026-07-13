---
project: build-a-url-parser
lesson: 14
title: Classifying the path
overview: The path is the one component always present, and its first character decides how it is interpreted during resolution. Today you classify a path as absolute, rootless, or empty, the distinction the reference-resolution algorithm hinges on later.
goal: Classify a path as absolute, rootless, or empty.
spec:
  scenario: Which kind of path
  status: failing
  lines:
    - kw: Given
      text: 'the paths "/a/b", "a/b", and the empty string'
    - kw: When
      text: 'each path is classified'
    - kw: Then
      text: '"/a/b" is absolute, "a/b" is rootless, and "" is empty'
    - kw: And
      text: 'at the boundary, a lone "/" is absolute and a lone "." is rootless, since a path is absolute exactly when it begins with a slash'
code:
  lang: go
  source: |
    type PathKind int
    const ( PathEmpty PathKind = iota; PathAbsolute; PathRootless )
    func classifyPath(p string) PathKind {
      // empty? starts with '/'? otherwise rootless
    }
checkpoint: A path now reports whether it is absolute, rootless, or empty. Commit and stop here.
---

The **path** holds the hierarchical identifier - the `/over/there` of a URL. Unlike the other components it is never absent; the most it can be is empty. RFC 3986 distinguishes a handful of path forms, but the one that matters for what follows is simple: a path is **absolute** if it starts with a `/`, **rootless** (relative) if it is non-empty and does not, and **empty** if it has no characters at all.

This three-way split feels trivial today but it is exactly what the resolution algorithm branches on. When you resolve a relative reference against a base, an empty reference path means "keep the base's path", an absolute reference path replaces it wholesale, and a rootless path gets *merged* onto the base's directory. Each of those is a different code path selected by this classification, so pinning it down now - with the rule stated as plainly as "absolute iff it begins with a slash" - gives the resolver a clean predicate to lean on. The dot-segment cleanup you build next also cares about the leading slash.
