---
project: build-a-png-codec
lesson: 43
title: Writing a chunk
overview: The encoder is the decoder run backward, and it starts by writing chunks. Today you serialize a chunk - length, type, data, and a fresh CRC - reusing the CRC32 you built for decoding.
goal: Serialize a chunk as its big-endian length, type bytes, data, and a computed CRC32.
spec:
  scenario: Writing a chunk to bytes
  status: failing
  lines:
    - kw: Given
      text: 'a chunk of type "IEND" with empty data'
    - kw: When
      text: it is serialized
    - kw: Then
      text: 'the bytes are 0x00,0x00,0x00,0x00, then "IEND", then the CRC 0xAE,0x42,0x60,0x82'
    - kw: And
      text: 'the 4-byte length is the data length big-endian, and the CRC is CRC32 over the type bytes followed by the data'
code:
  lang: go
  source: |
    func writeChunk(typ string, data []byte) []byte {
      out := beUint32(uint32(len(data)))      // 4-byte big-endian length
      out = append(out, typ...)
      out = append(out, data...)
      crc := CRC32(append([]byte(typ), data...))
      return append(out, beUint32(crc)...)     // 4-byte big-endian CRC
    }
checkpoint: You can serialize any chunk with a correct length and CRC. Commit and stop here.
---

Writing PNG is decoding in reverse, and the chunk is the unit again. To serialize one you emit its four parts in order: a **4-byte big-endian length** (of the data only), the **4 type bytes**, the **data**, and a freshly **computed CRC32** over the type and data - the very same CRC function that *validated* chunks on the way in, now producing the value instead of checking it. The empty `IEND` chunk is the perfect first target: zero length, type `IEND`, and the constant CRC `0xAE426082` you have seen since chapter two.

Big-endian length and CRC-over-type-and-data are the two things to get right, and they mirror the reader exactly - which is the point. Every chunk the encoder writes, `IHDR`, `IDAT`, `IEND`, goes through this one function, so its correctness is the encoder's foundation. Get the byte order and CRC coverage matching the decoder and any chunk you write will read back cleanly, by your own code and by any other PNG decoder.
