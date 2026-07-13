---
project: build-an-lsm-storage-engine
lesson: 6
title: Encoding a record
overview: Before anything reaches disk it has to become bytes. Today you design the record - the one on-disk unit for a single write - as a self-describing byte encoding that round-trips exactly, carrying a kind tag so deletes fit in later without a redesign.
goal: Encode a record (kind, key, value) to bytes and decode it back to the same values.
spec:
  scenario: Round-tripping a record through bytes
  status: failing
  lines:
    - kw: Given
      text: 'a record with kind = Put, key = "apple", value = "red"'
    - kw: When
      text: it is encoded to bytes and then decoded back
    - kw: Then
      text: 'the result is kind = Put, key = "apple", value = "red"'
    - kw: And
      text: 'two records encoded one after another decode back as two separate records (each carries its own lengths)'
code:
  lang: go
  source: |
    type Kind uint8
    const ( Put Kind = 0; Delete Kind = 1 ) // Delete is used later
    // layout: [kind:1][keyLen:4][key][valLen:4][value]
    // length prefixes make it self-describing, so records can be
    // read back-to-back with no separators
    func encodeRecord(kind Kind, key string, value []byte) []byte { /* ... */ }
    func decodeRecord(b []byte) (kind Kind, key string, value []byte, n int) { /* n = bytes consumed */ }
checkpoint: A record encodes to bytes and decodes back exactly, and records concatenate cleanly. Commit and stop here.
---

Everything durable in the engine is a stream of **records**, so the record format
is the foundation the WAL and the SSTable both stand on. A record captures one
write: a **kind**, a **key**, and a **value**. Making it **self-describing** -
each field prefixed by its byte length - is what lets you write records
back-to-back into a file and read them apart again with no delimiters to escape.

The **kind** tag earns its place today even though you only ever set `Put` for
now. Deletes, a few chapters away, are just records with `kind = Delete` and no
value - a **tombstone**. Reserving the tag in the format from the first byte means
adding deletes later is a new *value* of an existing field, not a breaking change
to every file already on disk. Decoding also returns how many bytes it consumed,
so the reader knows where the next record begins.
