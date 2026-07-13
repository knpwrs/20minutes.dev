---
project: build-a-png-codec
lesson: 11
title: Validating a chunk's CRC
overview: Now the CRC earns its place. Today you check that a chunk's stored CRC matches the CRC computed over its type and data, so the decoder can reject corruption instead of trusting broken bytes.
goal: Report whether a chunk is intact by comparing its stored CRC against the CRC32 of its type bytes followed by its data.
spec:
  scenario: Checking chunk integrity
  status: failing
  lines:
    - kw: Given
      text: 'an IEND chunk - type "IEND", empty data - whose stored CRC field is 0xAE426082'
    - kw: When
      text: the chunk is validated
    - kw: Then
      text: 'it reports valid, because CRC32 over the type bytes "IEND" plus its empty data is 0xAE426082'
    - kw: And
      text: 'if any single data byte is changed, the recomputed CRC no longer matches and the chunk reports invalid'
code:
  lang: go
  source: |
    func (c Chunk) Valid() bool {
      // CRC covers the 4 type bytes THEN the data bytes - not the length
      buf := append([]byte(c.Type), c.Data...)
      return CRC32(buf) == c.CRC
    }
checkpoint: You can tell an intact chunk from a corrupted one. Commit and stop here.
---

A chunk's CRC covers its **type bytes and its data**, in that order - and pointedly *not* the length field. So to validate, you recompute `CRC32(type ++ data)` and compare it to the CRC that was stored after the data. Match means intact; mismatch means the bytes were damaged in transit or on disk, and the chunk should be rejected rather than decoded. The `IEND` chunk is the perfect anchor: empty data, so its CRC is just `CRC32("IEND")`, the `0xAE426082` you already pinned.

This is the guarantee that lets the rest of the codec trust what it reads. Flip one bit anywhere in the type or data and the recomputed CRC diverges wildly - that avalanche is exactly what a CRC is designed for. Getting the covered range right (type and data, excluding length) is the one subtlety, and the spec pins both the passing case and a corrupted one.
