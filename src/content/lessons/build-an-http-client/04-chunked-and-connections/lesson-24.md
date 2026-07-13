---
project: build-an-http-client
lesson: 24
title: Many chunks, hex sizes
overview: A real chunked body is many chunks, and their sizes are written in hexadecimal, not decimal. Today you loop over all the chunks and read their sizes as hex.
goal: Decode a multi-chunk body, concatenating the pieces and reading each size as hexadecimal.
spec:
  scenario: Decoding several chunks with hex sizes
  status: failing
  lines:
    - kw: Given
      text: 'the chunked body "1\r\nH\r\n4\r\nello\r\n0\r\n\r\n"'
    - kw: When
      text: it is decoded
    - kw: Then
      text: 'the decoded body is "Hello" (a 1-byte chunk then a 4-byte chunk, concatenated)'
    - kw: And
      text: 'sizes are hexadecimal - a chunk announced as "a" is 10 bytes, so "a\r\n0123456789\r\n0\r\n\r\n" decodes to "0123456789"'
code:
  lang: go
  source: |
    // loop: read a size line, parse it as HEX (not decimal), read
    // that many data bytes + the trailing CRLF, and append. repeat
    // until a size of 0, which ends the body.
    //   size := parseHex(line)   // "a" -> 10, "1a" -> 26
    //   if size == 0 { break }
checkpoint: You can decode a full multi-chunk body with hexadecimal sizes. Commit and stop here.
---

A real chunked body is a **loop**: read a chunk, append its data, read the next,
until the zero chunk. `1\r\nH\r\n4\r\nello\r\n0\r\n\r\n` is a one-byte chunk `H` and
a four-byte chunk `ello`, decoding to `Hello`. The decoder just repeats the
single-chunk logic until the terminator, gathering the pieces.

The catch that trips people is that **chunk sizes are hexadecimal**. A size line of
`a` means ten bytes, not ten written in decimal; `1a` means twenty-six. A body large
enough to have a chunk of ten-plus bytes will announce it in hex, and parsing that
size as decimal silently reads the wrong count and desynchronizes the whole stream.
Parse the size as base sixteen and the decoder handles bodies of any size.
