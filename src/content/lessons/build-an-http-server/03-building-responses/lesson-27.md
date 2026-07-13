---
project: build-an-http-server
lesson: 27
title: Content-Type from file extension
overview: A browser renders a file according to its Content-Type, so serving files means guessing the type from the extension. Today you map extensions to MIME types.
goal: Choose a Content-Type header for a served file based on its filename extension.
spec:
  scenario: Mapping extensions to MIME types
  status: failing
  lines:
    - kw: Given
      text: 'the served file is "index.html"'
    - kw: When
      text: its content type is determined
    - kw: Then
      text: 'the Content-Type is "text/html"'
    - kw: And
      text: '".css" gives "text/css", ".txt" gives "text/plain", and an unknown ".xyz" gives "application/octet-stream"'
code:
  lang: go
  source: |
    var mimeTypes = map[string]string{
        ".html": "text/html", ".css": "text/css",
        ".txt": "text/plain", ".json": "application/json",
    }
    ct := mimeTypes[strings.ToLower(filepath.Ext(name))]
    if ct == "" { ct = "application/octet-stream" }
checkpoint: 'Served files carry a Content-Type guessed from their extension. Commit.'
---

The bytes of a file do not say what they are — a browser decides whether to render
`<h1>Home</h1>` as a heading or show it as source based entirely on the
**`Content-Type`** you send. The conventional way to guess it is the filename
**extension**: `.html` is `text/html`, `.css` is `text/css`, and so on.

Keep a small extension-to-MIME table and default anything unrecognized to
`application/octet-stream`, the catch-all meaning "arbitrary bytes, let the client
decide." Set this header on the file responses from the previous lesson so pages
and stylesheets render instead of downloading.
