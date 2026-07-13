---
project: build-an-http-client
lesson: 2
title: Host and path
overview: After the scheme comes the part that names the machine and the resource on it. Today you split the authority (the host) from the path, so the client knows both where to connect and what to ask for.
goal: Parse the host and path out of the part of the URL after the scheme.
spec:
  scenario: Separating the host from the path
  status: failing
  lines:
    - kw: Given
      text: 'the URL string "http://example.com/a/b"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the URL has host "example.com" and path "/a/b"'
    - kw: And
      text: 'parsing "http://example.com" (no path) gives host "example.com" and path "/" (the default)'
code:
  lang: go
  source: |
    // after "scheme://" comes the authority, then the path.
    // the authority ends at the first "/", "?", or "#" - or the
    // end of the string. everything from that "/" onward is the path.
    // when there is no path at all, the path defaults to "/".
    func Parse(raw string) (*URL, error) {
      // strip "scheme://", then split authority from path on the first "/"
    }
checkpoint: A parsed URL now carries its host and a path that defaults to "/". Commit and stop here.
---

After `scheme://` comes the **authority** - for our purposes the **host**, the name
of the machine to connect to - followed by the **path**, the resource to ask that
machine for. In `http://example.com/a/b`, the host is `example.com` and the path is
`/a/b`. The authority runs from just after `://` up to the first `/`, `?`, or `#`,
whichever comes first; everything from that `/` onward is the path.

The one edge worth pinning now is the **empty path**. A URL like
`http://example.com` names a host but no resource, and a request must still ask for
*something* - so the path defaults to `/`, the root. Getting this default in early
means every later lesson can assume the path is never empty.
