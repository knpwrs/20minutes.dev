---
project: build-a-wav-pcm-toolkit
lesson: 1
title: The four-byte chunk id
overview: A WAV file is built out of chunks, and every chunk starts with a four-byte ASCII tag that names it. Today you read those four bytes back as text, the smallest possible first step into the format.
goal: Read four bytes and return them as a four-character ASCII string.
spec:
  scenario: A four-byte id decodes to its ASCII name
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0x52 0x49 0x46 0x46'
    - kw: When
      text: 'they are read as a four-byte id'
    - kw: Then
      text: 'the id is the string "RIFF"'
    - kw: And
      text: 'the bytes 0x66 0x6D 0x74 0x20 read as the id "fmt " (with a trailing space)'
code:
  lang: go
  source: |
    // a chunk id is just four ASCII bytes, read in order
    func readID(b []byte) string {
      return string(b[0:4])
    }
checkpoint: You can read a four-byte chunk id as text. Commit and stop here.
---

The WAV format is a specific use of a general container called **RIFF** (Resource
Interchange File Format). A RIFF file is a sequence of **chunks**, and every chunk
begins with a **four-character code** - four raw ASCII bytes that name what the
chunk is. `RIFF`, `WAVE`, `fmt `, and `data` are the ones you will meet first.

These tags are stored as plain bytes, big-endian in the sense that byte order is
just reading order - the first byte is the first character. Note that `fmt ` is
four characters including a trailing **space** (`0x20`); the format is strict about
the count, so the space is real and required. Today is deliberately tiny: turn four
bytes into a string. Every chunk you parse from here on starts exactly this way.
