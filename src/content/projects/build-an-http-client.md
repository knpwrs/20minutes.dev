---
title: 'Build an HTTP Client'
order: 15
lessons: 41
size: 'Medium'
tech: ['HTTP/1.1', 'Message parsing', 'Chunked encoding']
estMin: 20
desc: 'Speak HTTP/1.1 by hand: build requests, parse responses, chunked bodies, redirects, and cookies.'
blurb: "Model the transport as a plain byte stream and everything becomes checkable offline: a request is exact bytes ending CRLFCRLF, a response is those bytes read back. Each lesson pins one rule with concrete values - the default port for a scheme, a chunk that ends in 0 CRLF CRLF, a header value that keeps its colons, whether a 303 turns your POST into a GET. The finished core drives a real socket in the capstone."
overview: |
  Over 41 lessons you build a working HTTP/1.1 client from first principles, one rule of the wire format at a time. You start by parsing a URL into scheme, host, port, path, query, and fragment - with default ports and percent-encoding - then serialize a request to the exact raw bytes an HTTP server expects: a request line, a Host header, a sorted header block, and a body framed by Content-Length, all ending in the blank line that terminates a message. Then you turn around and parse a response back from a byte stream: the status line, the headers (case-insensitive, colons and folding and all), and the body - by Content-Length, by chunked transfer-encoding, or by reading to the end of the stream.

  With the message core solid you handle the things that make a client real: reading several responses off one keep-alive connection, following 301/302/303/307/308 redirects (and knowing which ones turn a POST into a GET), decoding and re-emitting cookies through a jar, and encoding Basic auth and application/x-www-form-urlencoded bodies. The whole transport is modeled as an abstract byte stream, so every lesson is verified offline against in-memory buffers with exact expected bytes.

  This is a teaching-grade client built around the real HTTP/1.1 message grammar. The capstone finalize wraps the unchanged request/response core in a real TCP socket and performs a live GET, printing the status, headers, and body. It is honest about its limits: it speaks HTTP/1.1 in the clear with no TLS (so no https transport), does not do gzip or other content-codings, and its redirect and cookie handling follow the common rules rather than every corner of the specifications.
parts:
  - name: 'Parsing the URL'
    count: 7
  - name: 'Building a request'
    count: 7
  - name: 'Parsing a response'
    count: 8
  - name: 'Chunked bodies and persistent connections'
    count: 6
  - name: 'Encodings: auth and forms'
    count: 6
  - name: 'Redirects and cookies'
    count: 7
caveats:
  note: 'The finished client correctly speaks plaintext HTTP/1.1 over a real TCP socket end to end - GET, headers, chunked and length framing, keep-alive, redirects, and cookies - but it deliberately stops short of a production client: no TLS, no compression, and several simplified subsystems.'
  future:
    - 'Add TLS/HTTPS support (dial 443 with a TLS handshake for https URLs) - the single biggest gap, since almost every real site requires it today'
    - 'Support gzip/deflate content-coding by sending Accept-Encoding and decompressing a Content-Encoding: gzip response body'
    - 'Implement full relative-reference URL resolution (dot-segments, paths relative to the current directory) instead of only absolute-URL and absolute-path Location values'
    - 'Build a real cookie jar with per-cookie Domain, Path, and Expires tracking instead of the current name-only, send-everywhere jar'
    - 'Add connection pooling so requests and redirect hops reuse one keep-alive connection per host instead of dialing a fresh TCP socket each time'
    - 'Expose configurable timeouts and a redirect limit so a slow or looping server cannot stall the client'
resources:
  - title: 'RFC 9110: HTTP Semantics'
    author: 'IETF'
    url: 'https://www.rfc-editor.org/rfc/rfc9110'
    note: 'The current definition of methods, status codes, header fields, redirects, and content semantics - the "what" of HTTP, independent of the wire version. The authority for the redirect and header rules in this project.'
  - title: 'RFC 9112: HTTP/1.1'
    author: 'IETF'
    url: 'https://www.rfc-editor.org/rfc/rfc9112'
    note: 'The HTTP/1.1 message format itself: the request line, the header block, message framing by Content-Length and chunked transfer-encoding, and connection management. This is the byte grammar the whole client is built to.'
  - title: 'RFC 3986: Uniform Resource Identifier (URI)'
    author: 'IETF'
    url: 'https://www.rfc-editor.org/rfc/rfc3986'
    note: 'The URI grammar and percent-encoding rules behind chapter one - scheme, authority, path, query, fragment, and which characters are reserved.'
  - title: 'MDN Web Docs: HTTP'
    author: 'Mozilla'
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP'
    note: 'A readable, example-driven companion to the RFCs: headers, methods, status codes, cookies, and redirects with worked examples. The friendliest place to look up a header while you build.'
  - title: 'RFC 6265: HTTP State Management Mechanism'
    author: 'IETF'
    url: 'https://www.rfc-editor.org/rfc/rfc6265'
    note: 'How Set-Cookie and Cookie actually work - parsing cookie attributes and the storage model behind the cookie jar in chapter six.'
  - title: 'RFC 4648: The Base16, Base32, and Base64 Data Encodings'
    author: 'IETF'
    url: 'https://www.rfc-editor.org/rfc/rfc4648'
    note: 'The base64 alphabet and padding rules you implement for Basic authentication in chapter five.'
---
