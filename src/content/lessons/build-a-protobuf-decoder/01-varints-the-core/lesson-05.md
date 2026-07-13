---
project: build-a-protobuf-decoder
lesson: 5
title: Truncated and over-long varints
overview: Real input can be malformed, and a decoder that reads past the end of a buffer or loops forever on garbage is a bug. Today you make the reader fail cleanly on a varint that runs off the end and on one that is impossibly long.
goal: Make ReadVarint report an error on a truncated varint and on one longer than ten bytes.
spec:
  scenario: A malformed varint is rejected, not crashed on
  status: failing
  lines:
    - kw: Given
      text: 'a reader over the single byte 0x96 (continuation bit set, but no byte follows)'
    - kw: When
      text: 'ReadVarint is called'
    - kw: Then
      text: 'it returns an error rather than reading past the end of the buffer'
    - kw: And
      text: 'a stream of eleven bytes each 0x80 also errors, because a 64-bit varint is at most ten bytes long'
code:
  lang: go
  source: |
    func (r *Reader) ReadVarint() (uint64, error) {
      var result uint64
      var shift uint
      for i := 0; ; i++ {
        if r.AtEnd() { return 0, errTruncated }
        if i >= 10 { return 0, errVarintTooLong } // 64 bits need <= 10 groups
        b := r.ReadByte()
        result |= uint64(b&0x7F) << shift
        if b&0x80 == 0 { return result, nil }
        shift += 7
      }
    }
checkpoint: Your varint reader rejects truncated and over-long input. Commit and stop here.
---

A varint says "keep going" with its continuation flag, but the buffer can end
before a byte with the flag clear ever arrives - a **truncated** varint. Without a
guard, the reader indexes past the slice and panics. Check `AtEnd` before every
`ReadByte` and return an error instead. This is the first place the reader's
signature grows an `error`; later lessons thread that through.

The other failure is an **over-long** varint. A 64-bit value needs at most ten
7-bit groups (nine full groups is 63 bits, the tenth carries the last bit), so any
varint that has not terminated by its tenth byte is malformed and must be rejected
rather than shifted into oblivion. Pinning both edges now - the empty-continuation
case and the ten-byte ceiling - means every varint the rest of the decoder reads
is either a real number or a clean error.
