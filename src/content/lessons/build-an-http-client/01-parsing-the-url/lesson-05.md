---
project: build-an-http-client
lesson: 5
title: The fragment is client-only
overview: A URL can end in a hash and a fragment - the part that names a spot within a document. It matters to a browser but is never sent to the server, so today you strip it off and keep it separate.
goal: Split a trailing fragment off the URL and record that it is not part of what gets sent.
spec:
  scenario: Stripping the fragment
  status: failing
  lines:
    - kw: Given
      text: 'the URL string "http://example.com/doc?p=1#section-2"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the URL has rawQuery "p=1" and fragment "section-2"'
    - kw: And
      text: 'the fragment is not part of the path or the query - "http://example.com/a#top" gives path "/a" and fragment "top"'
code:
  lang: go
  source: |
    // the fragment is everything after the first "#".
    // strip it FIRST, before splitting path and query, because
    // "#" can appear after the "?". the fragment is stored but
    // never written into a request.
    func Parse(raw string) (*URL, error) {
      // cut off "#fragment" before parsing path and query
    }
checkpoint: A parsed URL now isolates its fragment, which later lessons will never send. Commit and stop here.
---

The last piece of a URL is the **fragment**: the part after a `#`, like
`section-2` in `.../doc#section-2`. It tells a browser where to scroll within a
page, and it is purely a **client-side** concern - the fragment is *never* sent to
the server. A request for that URL asks for `/doc` with query `p=1` and says
nothing about `section-2`.

Because the `#` can appear after the `?`, the clean order is to strip the fragment
**first**, then split the remainder into path and query. Store the fragment on the
URL for completeness, but remember its role: when you build the request line in
chapter two, the fragment stays behind. Getting it out of the way now keeps every
later component honest about what actually travels over the wire.
