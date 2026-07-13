---
project: build-a-midi-parser
lesson: 9
title: The track reader
overview: Parsing a track means reading fields one after another while remembering where you are. Today you build a small stateful reader - a byte slice plus a position - that hands out bytes, 16-bit words, and VLQs and advances itself.
goal: Build a reader over a byte slice that reads a byte and a VLQ, advancing its position.
spec:
  scenario: The reader advances its position as it reads
  status: failing
  lines:
    - kw: Given
      text: 'a reader over the bytes 0x81 0x00 0x3C with position 0'
    - kw: When
      text: 'a VLQ is read, then a single byte'
    - kw: Then
      text: 'the VLQ is 128 and the position is now 2'
    - kw: And
      text: 'the next byte read is 0x3C and the position is now 3'
code:
  lang: go
  source: |
    type Reader struct {
      buf []byte
      pos int
    }
    // name it NextByte, not ReadByte: a ReadByte() byte signature trips go vet
    func (r *Reader) NextByte() byte { b := r.buf[r.pos]; r.pos++; return b }
    func (r *Reader) ReadVLQ() uint32 {
      v, n := decodeVLQ(r.buf[r.pos:]) // reuse lesson 7
      r.pos += n
      return v
    }
checkpoint: You have a reader that advances as it reads bytes and VLQs. Commit and stop here.
---

Every event in a track is a delta-time followed by some bytes, then another event,
with no length prefix on the individual events - so you read the body **left to
right**, and each read has to leave the cursor exactly where the next one starts. A
tiny **reader** carrying the buffer and a `pos` index captures that: `NextByte`
returns one byte and steps forward by one; `ReadVLQ` decodes a variable-length
quantity and steps forward by however many bytes it spanned. (Call the byte method
`NextByte`, not `ReadByte` - a `ReadByte() byte` signature clashes with Go's
`io.ByteReader` convention and trips the linter.)

This wraps the pure helpers you already wrote into something stateful and
convenient - the two facets to confirm are that a multi-byte VLQ advances the
position by the right amount (two, for `0x81 0x00`) and that the following
`NextByte` picks up exactly where it left off. From here on, parsing an event is
just a sequence of reader calls, and the reader keeps the bookkeeping honest.
