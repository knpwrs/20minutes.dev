---
project: build-a-dns-resolver
lesson: 6
title: A length-prefixed label
overview: Domain names on the wire are not dotted strings - they are sequences of length-prefixed labels. Today you encode a single label, the building block of every name, by putting its byte count in front of its characters.
goal: Encode one label as its length byte followed by its ASCII characters.
spec:
  scenario: A label is its length followed by its bytes
  status: failing
  lines:
    - kw: Given
      text: 'the label text "example"'
    - kw: When
      text: 'it is encoded as a label'
    - kw: Then
      text: 'the result is the 8 bytes 07 65 78 61 6d 70 6c 65 (a length byte 7, then the ASCII of example)'
    - kw: And
      text: 'the label "com" encodes to 03 63 6f 6d'
code:
  lang: go
  source: |
    func encodeLabel(s string) []byte {
      out := []byte{byte(len(s))} // the length prefix
      return append(out, s...)    // then the raw characters
    }
    // "example" -> 07 'e' 'x' 'a' 'm' 'p' 'l' 'e'
checkpoint: You can encode a single length-prefixed label. Commit and stop here.
---

A DNS name like `www.example.com` is never sent as text with dots. Instead it is a
run of **labels**, and each label is a single **length byte** (how many characters
follow) then those characters as raw ASCII. The dots are implied by where one
label ends and the next begins. So `example` becomes the byte `7` followed by the
seven bytes of `example`.

This length-prefix framing is what lets a parser walk a name without needing a
delimiter: read one byte, then read that many characters, repeat. A single label's
length must fit in six bits (at most 63), because the top two bits of a length
byte are reserved for something you will meet in chapter three. Today just nail the
one-label case; stringing labels together into a full name is next.
