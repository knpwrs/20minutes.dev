---
project: build-a-protobuf-decoder
lesson: 8
title: Length-delimited values
overview: 'The Len wire type prefixes its value with a varint byte count, and that one mechanism carries strings, bytes, embedded messages, and packed fields alike. Today you read a length-delimited chunk: a varint length, then exactly that many raw bytes.'
goal: Read a length-delimited value as a varint length followed by that many bytes.
spec:
  scenario: A Len value is a length prefix plus its bytes
  status: failing
  lines:
    - kw: Given
      text: 'a reader over the bytes 0x05, 0x68, 0x65, 0x6C, 0x6C, 0x6F'
    - kw: When
      text: 'ReadBytes is called'
    - kw: Then
      text: 'it returns the five bytes 0x68, 0x65, 0x6C, 0x6C, 0x6F and the position is now 6'
    - kw: And
      text: 'a length prefix of 0x00 returns an empty slice, and a length that runs past the end of the buffer returns an error'
code:
  lang: go
  source: |
    // read the varint length, then slice off that many bytes
    func (r *Reader) ReadBytes() ([]byte, error) {
      n, err := r.ReadVarint()
      if err != nil { return nil, err }
      // bounds-check n against what remains before slicing
      out := r.buf[r.pos : r.pos+int(n)]
      r.pos += int(n)
      return out, nil
    }
checkpoint: You can read a length-delimited chunk of bytes. Commit and stop here.
---

The **Len** wire type is the workhorse of protobuf. Its value is written as a
varint **length** followed by exactly that many bytes of payload, and the decoder
does not need to know what those bytes mean to read past them - a string, a nested
message, and a packed list of integers all look identical at this level: a count
and a blob. That uniformity is why one wire type covers so much.

Read the length as a varint, then take that many bytes. Two edges matter: a length
of 0 is legal and yields an empty payload (an empty string is a real value), and a
length that claims more bytes than remain in the buffer is malformed and must
error rather than slice out of bounds. Guard `pos + n` against the buffer length
before slicing. Later lessons will hand these payload bytes to a fresh reader to
decode strings and recurse into nested messages.
