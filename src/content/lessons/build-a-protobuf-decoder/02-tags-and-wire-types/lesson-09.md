---
project: build-a-protobuf-decoder
lesson: 9
title: Skipping a field by wire type
overview: A decoder must be able to step over a field it does not care about, and to do that it only needs the wire type, not the schema. Today you build Skip, which consumes exactly one value of each wire type and rejects an unknown one.
goal: Skip a field value given its wire type, consuming the right number of bytes.
spec:
  scenario: Each wire type is skipped by consuming its value
  status: failing
  lines:
    - kw: Given
      text: 'a reader positioned at a field value and its wire type'
    - kw: When
      text: 'Skip is called for wire type 0 over the bytes 0x96, 0x01'
    - kw: Then
      text: 'both varint bytes are consumed and the position advances by 2'
    - kw: And
      text: 'wire type 5 (I32) advances by 4, wire type 1 (I64) advances by 8, wire type 2 (Len) consumes its length prefix plus that many bytes, and an unknown wire type such as 3 returns an error'
code:
  lang: go
  source: |
    func (r *Reader) Skip(wire int) error {
      switch wire {
      case WireVarint: _, err := r.ReadVarint(); return err
      case WireI64:    return r.advance(8)
      case WireI32:    return r.advance(4)
      case WireLen:    _, err := r.ReadBytes(); return err
      default:         return fmt.Errorf("bad wire type %d", wire)
      }
    }
checkpoint: You can skip any known field and reject an unknown wire type. Commit and stop here.
---

Forward and backward compatibility depend on one small ability: when a decoder
meets a field it was not built to understand, it can **skip** it and keep going.
Skipping needs only the wire type. A **Varint** value is skipped by reading a
varint and discarding it; an **I32** is always 4 bytes and an **I64** always 8, so
you advance the cursor by a fixed amount without interpreting them; a **Len** value
is skipped by reading its length and stepping over that many bytes, which
`ReadBytes` already does.

Any wire type outside the set 0, 1, 2, 5 - including the retired group markers 3
and 4 - is not something this decoder can consume, so `Skip` must return an error
rather than guess. This makes `Skip` the natural place to catch a **bad wire
type**, and it is the exact machinery the final chapter reuses to preserve unknown
fields: to keep an unknown field you first need to know precisely where its bytes
end, which is what advancing correctly by wire type tells you.
