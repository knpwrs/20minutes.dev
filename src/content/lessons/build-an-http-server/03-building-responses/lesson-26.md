---
project: build-an-http-server
lesson: 26
title: Serve a file from disk
overview: Most of the web is static files, so today you add a handler that reads a file off disk and returns its contents, turning your server into a real file server.
goal: Serve the contents of a file under a root directory as the response body.
spec:
  scenario: Serving a static file
  status: failing
  lines:
    - kw: Given
      text: 'a root directory containing "index.html" with contents "<h1>Home</h1>"'
    - kw: When
      text: 'a request for GET "/index.html" is served'
    - kw: Then
      text: 'the response status is 200 and the body is "<h1>Home</h1>"'
code:
  lang: go
  source: |
    full := filepath.Join(root, filepath.Clean("/"+r.Path))
    data, err := os.ReadFile(full)
    if err == nil {
        return Response{Status: 200, Body: data}
    }
checkpoint: 'Your server reads a file off disk and serves it. Commit.'
---

Static files are the bread and butter of an HTTP server. A **file handler** maps
the request path onto a file under a root directory, reads its bytes, and returns
them as the body. The path `/index.html` becomes `root/index.html` on disk.

Join the path onto the root carefully — cleaning it first collapses any `..`
segments so a request cannot escape the root and read arbitrary files (path
traversal is a classic hole). Read the bytes and hand them back as a `200`;
picking the right `Content-Type` and handling a missing file are the next two
steps.
