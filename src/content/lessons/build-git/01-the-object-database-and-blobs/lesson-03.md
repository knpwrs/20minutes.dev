---
project: build-git
lesson: 3
title: 'The object id is the SHA-1 of the object'
overview: 'An object''s identity in Git is the SHA-1 hash of its serialized bytes, written as 40 lowercase hex characters. This is the content-addressable idea at the heart of Git, and today your ids start matching real Git exactly.'
goal: 'Compute an object id as the SHA-1 of its loose object bytes.'
spec:
  scenario: The id is the SHA-1 of the serialized object
  status: failing
  lines:
    - kw: Given
      text: 'the serialized loose object bytes for some content'
    - kw: When
      text: 'HashObject(blob, content) takes the SHA-1 of those bytes as 40 lowercase hex characters'
    - kw: Then
      text: 'HashObject(blob, hello and a newline) is ce013625030ba8dba906f756967f9e9ca394464a'
    - kw: And
      text: 'HashObject(blob, empty content) is e69de29bb2d1d6434b8b29ae775ad8c2e48c5391, the well-known empty blob id'
code:
  lang: go
  source: |
    // hash the serialized bytes, not the raw content
    func HashObject(typ string, content []byte) string {
      sum := sha1.Sum(Serialize(typ, content))
      return hex.EncodeToString(sum[:])
    }
reading: 'You can confirm any of these ids with real Git, for example printf ''hello\n'' | git hash-object --stdin'
checkpoint: 'Your object ids match real Git for blobs. Commit and stop here.'
---

This is the moment the whole design clicks: an object's **id is its content**,
run through SHA-1. Hash the serialized bytes (header, NUL, and content together)
and render the 20-byte digest as 40 lowercase hex characters. Two files with
identical content get the same id automatically, because the id is a pure
function of the bytes. That is what "content-addressable" means.

The values are not ours to choose; they are whatever SHA-1 produces, and they are
identical to real Git because we hash the exact same wrapped bytes Git does. The
empty blob `e69de29b...` is a constant you will see in real repositories, and
`hello\n` always hashes to `ce013625...`. We lean on the standard library for
SHA-1 here - earlier projects built hashing from scratch; this one is about the
object model, not the hash function.
