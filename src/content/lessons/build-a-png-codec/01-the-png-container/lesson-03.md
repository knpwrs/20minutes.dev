---
project: build-a-png-codec
lesson: 3
title: Reading a whole chunk
overview: A chunk is more than its header - after the type come the data bytes and a trailing four-byte CRC. Today you read one complete chunk into a small record so later lessons have a clean object to work with.
goal: Read one full chunk - type, data, and its stored CRC - and report how many bytes it consumed.
spec:
  scenario: Reading a complete chunk record
  status: failing
  lines:
    - kw: Given
      text: 'a chunk of length 1 with type "gAMA", one data byte 0x2A, and a stored CRC field of 0x11223344'
    - kw: When
      text: the whole chunk is read
    - kw: Then
      text: 'the record has type "gAMA", data [0x2A], and CRC 0x11223344'
    - kw: And
      text: 'the reader reports it consumed 13 bytes total (4 length + 4 type + 1 data + 4 CRC)'
code:
  lang: go
  source: |
    type Chunk struct {
      Type string
      Data []byte
      CRC  uint32 // stored value; validating it comes later
    }
    // layout: [len:4][type:4][data:len][crc:4]; total consumed = 12 + len
    func readChunk(b []byte) (Chunk, int) { /* slice out each field */ }
checkpoint: You can read one complete chunk into a record and know its byte span. Commit and stop here.
---

A full chunk is four parts in a row: the 4-byte length, the 4-byte type, exactly `length` bytes of **data**, and a 4-byte **CRC** that guards the type and data together. Today you read all four into a small `Chunk` record. Do not validate the CRC yet - just store the value that is there; checking it is a whole chapter of its own once you can compute a CRC32.

The useful extra you return is **how many bytes the chunk occupied**: `12 + length` (the four fixed header bytes, the four type bytes, the four CRC bytes, plus the data). That total is what lets the next lesson step from one chunk to the next without losing its place. Slice the data out by its exact length so a zero-length chunk yields an empty slice rather than reading into the CRC.
