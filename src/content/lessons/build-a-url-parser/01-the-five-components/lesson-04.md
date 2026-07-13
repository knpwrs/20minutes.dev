---
project: build-a-url-parser
lesson: 4
title: The fragment, and present versus absent
overview: The fragment is the part after a hash, and it introduces a distinction that runs through the whole parser - a component can be present but empty, which is different from being absent. Today you split off the fragment and make that difference observable.
goal: Split off the fragment after the first hash and record whether a fragment was present at all.
spec:
  scenario: Splitting the fragment
  status: failing
  lines:
    - kw: Given
      text: 'the input "path#section"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Path is "path", HasFragment is true, and Fragment is "section"'
    - kw: And
      text: 'Parse("path#") has HasFragment true with Fragment "", while Parse("path") has HasFragment false'
code:
  lang: go
  source: |
    // the fragment is everything after the FIRST '#'
    // an empty fragment ("path#") is still PRESENT
    if i := strings.IndexByte(rest, '#'); i >= 0 {
      u.Fragment = rest[i+1:]
      u.HasFragment = true
      rest = rest[:i]
    }
checkpoint: Parse now peels the fragment off the end and tracks whether one was present. Commit and stop here.
---

The **fragment** is a secondary reference into the resource - the `#section` that scrolls a browser to an anchor. It is introduced by the first `#` in the URI and runs to the very end, which makes it the last component to strip: everything after that first hash is the fragment, everything before it is still to be parsed. Because the hash and everything after it are gone once you split, doing the fragment early keeps a stray `#` from confusing the query and path boundaries.

The subtle part is the difference between `path#` and `path`. The first has an **empty** fragment; the second has **no** fragment at all. RFC 3986 treats these as genuinely distinct, and reference resolution depends on it: a reference with an empty fragment clears the base's fragment, while a reference with no fragment leaves it alone. That is why the struct carries `HasFragment` next to `Fragment` - a bare empty string could not tell the two cases apart. Setting the boolean the moment you see a `#`, even with nothing after it, is what keeps that information alive.
