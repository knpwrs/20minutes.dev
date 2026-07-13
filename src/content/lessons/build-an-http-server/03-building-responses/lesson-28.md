---
project: build-an-http-server
lesson: 28
title: Return 404 for a missing file
overview: A request for a file that is not there should return a clean 404, not an error. Today you handle the missing-file case, completing a working static file server.
goal: Return 404 when a requested file does not exist, and 200 when it does.
spec:
  scenario: Serving a missing versus present file
  status: failing
  lines:
    - kw: Given
      text: 'a root directory containing "index.html" but not "nope.html"'
    - kw: When
      text: 'GET "/nope.html" is served'
    - kw: Then
      text: 'the response status is 404'
    - kw: And
      text: 'GET "/index.html" is served with status 200'
code:
  lang: go
  source: |
    data, err := os.ReadFile(full)
    if err != nil { // no such file, or unreadable
        return Response{Status: 404, Body: []byte("Not Found")}
    }
    return Response{Status: 200, Body: data, Headers: ...}
checkpoint: 'You have a working static file server - point it at a directory and browse it. Commit.'
---

Reading a file can fail — most often because it is not there — and the file
handler must turn that into a `404` rather than a panic or a blank `200`. Any
read error becomes "Not Found"; a successful read becomes the `200` you built,
with its `Content-Type` set.

With that, the chapter closes on a genuinely useful program: a **static file
server**. Point it at a directory of HTML and assets, open a browser, and it
serves the site — correct status codes, correct content types, missing files
handled. The last chapter makes it robust and able to handle many clients at once.
