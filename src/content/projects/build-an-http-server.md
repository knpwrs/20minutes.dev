---
title: 'Build an HTTP Server'
order: 7
lessons: 36
size: 'Medium'
tech: ['Sockets', 'HTTP/1.1']
estMin: 20
desc: 'Speak HTTP over a raw socket: parse requests, serve files, handle many clients.'
blurb: 'An HTTP server is a socket that speaks a text protocol. You build the accept loop and the parser against concrete specs, so each layer is solid before the next goes on top.'
overview: |
  Over 36 short lessons you build a working HTTP/1.1 server from a bare TCP socket up. You start with an accept loop that echoes bytes, then write a request parser (request line, headers, Content-Length bodies), a response serializer (status lines, headers, auto Content-Length), a router, and a static-file handler with content types.

  The last chapter makes it robust and concurrent: 400/404/405 error responses, HEAD, query parameters, one goroutine per connection, keep-alive, Connection: close, chunked request bodies, and an access log.

  The end result is a real, teaching-grade server you run and hit with curl or a browser — it serves static files and dynamic routes over persistent connections. It deliberately stops short of TLS, HTTP/2, and the parts of RFC 9110/9112 (caching, ranges, cookies, content negotiation) a production server adds on top.
parts:
  - name: 'Sockets'
    count: 6
  - name: 'Parsing requests'
    count: 11
  - name: 'Building responses'
    count: 11
  - name: 'Robust & concurrent'
    count: 8
caveats:
  note: 'The finished server runs and correctly handles routing, static files, persistent connections, HEAD, and chunked request bodies end to end, but still lacks production hardening like connection timeouts, request size limits, and graceful shutdown.'
  future:
    - "Add read/write deadlines per connection so a slow or silent client can't hold a connection open forever"
    - 'Cap the header block and body size to reject oversized requests instead of allocating unboundedly'
    - 'Handle SIGINT/SIGTERM for graceful shutdown instead of dropping connections mid-flight'
    - 'Support trailer headers after the final chunk of a chunked request body'
    - 'Serve a directory listing when a directory is requested and has no index.html'
    - 'Add TLS so the server can speak HTTPS'
resources:
  - title: 'RFC 9110: HTTP Semantics'
    url: 'https://www.rfc-editor.org/rfc/rfc9110'
    note: 'The current standard defining HTTP methods, headers, and status codes.'
  - title: 'RFC 9112: HTTP/1.1'
    url: 'https://www.rfc-editor.org/rfc/rfc9112'
    note: 'The wire-format spec for the request/response parsing this project implements directly.'
  - title: "Beej's Guide to Network Programming"
    url: 'https://beej.us/guide/bgnet/'
    note: 'A free, approachable guide to sockets - the layer HTTP sits on top of.'
  - title: 'HTTP: The Definitive Guide'
    author: 'David Gourley, Brian Totty'
    url: 'https://www.oreilly.com/library/view/http-the-definitive/1565925092/'
    note: 'A broader tour of HTTP in practice: caching, proxies, and connection management beyond the core spec.'
---
