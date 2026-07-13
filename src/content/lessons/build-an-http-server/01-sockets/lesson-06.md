---
project: build-an-http-server
lesson: 6
title: Answer with a canned response
overview: You can read a request and you can write bytes - today you connect them into a request-response loop that replies to every connection with a fixed 200. It is the first thing a browser will call a working web server.
goal: Read a request's head, then write a fixed "200 OK" response back to the client.
spec:
  scenario: The server responds to a request
  status: failing
  lines:
    - kw: Given
      text: 'the server receives "GET / HTTP/1.1\r\nHost: example.com\r\n\r\n"'
    - kw: When
      text: it finishes reading the head
    - kw: Then
      text: 'it writes back exactly "HTTP/1.1 200 OK\r\n\r\n"'
code:
  lang: go
  source: |
    func handle(conn net.Conn) {
        defer conn.Close()
        r := bufio.NewReader(conn)
        readHead(r) // consume the request so the client's write completes
        conn.Write([]byte("HTTP/1.1 200 OK\r\n\r\n"))
    }
checkpoint: 'curl http://localhost:PORT/ now gets a real 200 response from your server. Commit.'
---

Reading and writing finally meet: accept a connection, read its head, and send a
reply. That reply is still hard-coded — a bare status line and the blank line
that marks the end of the head, with no body — but it is a **valid HTTP
response**, and a browser or `curl` will accept it as a 200.

This is the walking skeleton of the whole server. From here every chapter
replaces one hard-coded piece with something real: first the request becomes a
parsed structure, then the response becomes something you build from a status,
headers, and a body.
