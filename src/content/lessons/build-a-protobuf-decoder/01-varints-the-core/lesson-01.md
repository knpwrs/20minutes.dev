---
project: build-a-protobuf-decoder
lesson: 1
title: A byte cursor
overview: Every protobuf message is a flat run of bytes read strictly left to right, so the first thing we need is a cursor that hands out the next byte and remembers where it is. Today you build that reader, the spine the whole decoder threads through.
goal: Build a reader over a byte slice that returns the next byte and advances its position.
spec:
  scenario: A reader walks a byte slice one byte at a time
  status: failing
  lines:
    - kw: Given
      text: 'a reader created over the bytes 0x08, 0x96, 0x01'
    - kw: When
      text: 'ReadByte is called three times in a row'
    - kw: Then
      text: 'it returns 0x08, then 0x96, then 0x01, and the position advances 0 to 1 to 2 to 3'
    - kw: And
      text: 'AtEnd reports true once all three bytes have been read'
code:
  lang: go
  source: |
    // the whole decoder reads through one of these
    type Reader struct {
      buf []byte
      pos int
    }
    func NewReader(b []byte) *Reader { return &Reader{buf: b} }
    func (r *Reader) ReadByte() byte { b := r.buf[r.pos]; r.pos++; return b }
    func (r *Reader) AtEnd() bool { return r.pos >= len(r.buf) }
checkpoint: You have a cursor that reads bytes in order and tracks its position. Commit and stop here.
---

A protobuf message has no framing, no delimiters, and no length at the front - it
is just a sequence of bytes that you interpret in order. Because of that, almost
every operation in this project is "read the next byte (or few), decide what it
means, advance." A small **cursor** that owns the buffer and a **position** is the
one abstraction every later lesson leans on.

Today is deliberately tiny: wrap a byte slice, hand back bytes one at a time, and
keep track of how far you have read. The `pos` field is the whole point - it is
what lets tomorrow's varint reader consume a variable number of bytes and leave
the cursor sitting exactly on the next field. Getting `AtEnd` right matters too:
the top-level decoder will loop "until the reader is at the end" to know when a
message is fully consumed.
