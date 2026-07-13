---
project: build-an-lsm-storage-engine
lesson: 10
title: Detecting a corrupted record
overview: Disks flip bits and crashes leave garbage. Today you add a checksum to each record so a corrupted one is caught on the way back in, rather than silently loading wrong data as if it were real.
goal: Store a checksum with each record and reject the record on decode if the bytes no longer match it.
spec:
  scenario: Rejecting a record whose bytes were altered
  status: failing
  lines:
    - kw: Given
      text: 'an encoded record (Put, "apple", "red") that carries a checksum'
    - kw: When
      text: any single byte of the key or value payload is flipped and the record is decoded
    - kw: Then
      text: decoding reports a corruption error rather than returning a value
    - kw: And
      text: an unmodified record still decodes to its original kind, key, and value
code:
  lang: go
  source: |
    // prepend a checksum over the payload:
    //   [crc:4][kind:1][keyLen:4][key][valLen:4][value]
    // on decode, recompute the crc over the payload and compare;
    // mismatch => return an error, do not return a value
    func encodeRecord(...) []byte  // now writes crc first
    func decodeRecord(b []byte) (Kind, string, []byte, int, error)
checkpoint: A tampered or corrupted record is detected on decode instead of loading silently. Commit and stop here.
---

Durability is not just "the bytes are on disk" - it is "the bytes on disk are
*trustworthy*". Hardware corrupts data at rest, and a crash can leave a record
half-written. A **checksum** (a CRC over the record's payload) is the guard: store
it alongside the record, and on the way back recompute it and compare. If they
disagree, the record is damaged and must not be trusted.

Today the record grows a checksum field and `decodeRecord` gains an error return.
An intact record still round-trips exactly; a record with even one flipped byte is
rejected. This is the mechanism the next lesson builds on: when a crash tears the
*last* record of the log in half, the checksum is what tells replay "this tail is
garbage - stop here" instead of loading a mangled key.
