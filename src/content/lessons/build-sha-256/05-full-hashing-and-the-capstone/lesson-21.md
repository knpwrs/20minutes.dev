---
project: build-sha-256
lesson: 21
title: The public hash function
overview: 'Now the pieces become one function: bytes in, 32-byte digest out. Today you wire padding, blocking, compression, and serialization into the public Sum256 and its hex form, and pin the "abc" digest end to end.'
goal: Hash a byte message to a 32-byte digest and its hex string through one public entry point.
spec:
  scenario: Hashing "abc" through the public API
  status: failing
  lines:
    - kw: Given
      text: 'the message "abc" as bytes'
    - kw: When
      text: 'Sum256(msg) pads it, splits it into blocks, compresses them from the initial hash, and serializes the eight result words big-endian into 32 bytes; Hex(msg) renders that as lowercase hex'
    - kw: Then
      text: 'Sum256 returns 32 bytes whose first four are 0xba 0x78 0x16 0xbf'
    - kw: And
      text: "Hex(\"abc\") is \"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad\""
code:
  lang: go
  source: |
    func Sum256(msg []byte) [32]uint8 {
      h := CompressBlocks(Blocks(Pad(msg)))
      var out [32]uint8
      for i, word := range h {           // each word -> 4 big-endian bytes
        out[i*4+0] = uint8(word >> 24)
        out[i*4+1] = uint8(word >> 16)
        out[i*4+2] = uint8(word >> 8)
        out[i*4+3] = uint8(word)
      }
      return out
    }
checkpoint: You have a working SHA-256 that hashes bytes to a digest. Commit and stop here.
---

Everything you have built now snaps together into the public interface. `Sum256`
is the whole pipeline in one line of composition: pad the message, split it into
blocks, thread the hash state through the compression loop, then **serialize** the
eight final words into 32 bytes. Serialization mirrors the reading you did in
lesson 13 - each word emits its four bytes big-endian, most significant first - so
`0xba7816bf` becomes the bytes `0xba 0x78 0x16 0xbf`. `Hex` just formats those 32
bytes as lowercase hex for display.

This is the deliverable the whole project was aiming at: a real SHA-256 you can
call on any byte string. Pin the canonical `"abc"` digest,
`ba7816bf...f20015ad`, end to end through the public API - not the internal word
array this time, but the actual 32 bytes and their hex, exactly as every SHA-256
tool on earth prints them. The remaining lessons check it against more official
vectors and add HMAC on top.
