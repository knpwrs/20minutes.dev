---
project: build-a-video-container-parser
lesson: 12
title: Finding a box by path
overview: Now that you have a tree, you need a way to reach into it. Today you look up a box by a slash-separated path like moov/trak/mdia/hdlr, which is how every later lesson will grab the exact box it needs.
goal: Find a box in the tree by a slash-separated type path, returning nil when it is absent.
spec:
  scenario: A path locates a nested box, or nothing
  status: failing
  lines:
    - kw: Given
      text: 'the tree from the moov/trak/mdia/hdlr buffer'
    - kw: When
      text: 'find is called with the path "moov/trak/mdia/hdlr"'
    - kw: Then
      text: 'it returns the hdlr box'
    - kw: And
      text: 'find with the path "moov/trak/tkhd" returns nil because no tkhd is present'
code:
  lang: go
  source: |
    // walk one path segment at a time, descending into children
    func find(boxes []Box, path string) *Box {
      parts := strings.Split(path, "/")
      // at each level, pick the child matching parts[0], then recurse
      // on its children with the rest of the path; return nil if missing
    }
checkpoint: You can find a box by path. Commit and stop here.
---

With a tree in hand, navigation should read like a filesystem path. `find` takes a
slash-separated list of types and walks down: match the first segment against the
boxes at this level, descend into that box's children, and continue with the rest
of the path. When the last segment matches, you have your box; when any segment has
no match, you return `nil`.

This single helper is what keeps every later lesson short. Instead of manually
threading through `moov`, then `trak`, then `mdia`, a lesson just asks for
`find(tree, "moov/trak/mdia/mdhd")` and parses the box it gets back. It also closes
the box-tree chapter with something you can genuinely use: give it a tree and a
path, and it hands you the exact box.
