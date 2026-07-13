---
project: build-a-compression-tool
lesson: 32
title: Refusing a broken archive
overview: A decoder meets hostile input eventually - a truncated download, a wrong file, a flipped byte. Today you make Decompress reject a broken archive with a clear error instead of panicking or looping forever.
goal: Have Decompress return an error for a short or wrong-magic archive rather than crashing.
spec:
  scenario: Broken archives are rejected cleanly
  status: failing
  lines:
    - kw: Given
      text: 'the two-byte input 0x5A, 0x5A (a header cut off before the method and length)'
    - kw: When
      text: 'Decompress runs'
    - kw: Then
      text: 'it returns a non-nil error and does not panic'
    - kw: And
      text: 'an input whose first two bytes are not 0x5A, 0x5A also returns a non-nil error (bad magic)'
    - kw: And
      text: 'a valid compressed archive truncated to fewer bytes (a corrupt DEFLATE-lite block) also returns an error and does not panic - the table and bit reads are bounds-checked'
code:
  lang: go
  source: |
    func Decompress(a []byte) ([]byte, error) {
      if len(a) < 7 { return nil, errors.New("archive too short") }
      if a[0] != 0x5A || a[1] != 0x5A { return nil, errors.New("bad magic") }
      // also bounds-check the payload length and every table read
      // so corrupt fields error instead of indexing out of range
    }
checkpoint: Decompress rejects short and malformed archives with a clear error. Commit and stop here.
---

Up to now the decoder has only seen archives its own encoder produced. Real inputs
are not so kind: a file can be truncated mid-header, be the wrong format entirely,
or have a byte corrupted in transit. A decoder that indexes blindly will **panic**
with an out-of-range access, which is a poor way to fail. The professional behavior
is to **validate and return an error**.

Two cheap checks catch most trouble. If the archive is shorter than the seven-byte
header, it cannot be valid - error out. If the first two bytes are not the
**magic** `0x5A 0x5A`, it is not our format - error out. Beyond the header, every
length field and table count should be bounds-checked against what remains, so a
corrupt count reports an error rather than reading past the end. The goal is
simple and absolute: `Decompress` returns `(nil, error)` on anything malformed and
**never panics**. This robustness is what separates a toy from a tool, and it sets
up the capstone, where the finished compressor faces real text with confidence.
