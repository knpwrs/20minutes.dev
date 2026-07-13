---
project: build-git
lesson: 5
title: 'Writing an object to the store'
overview: 'Now we actually persist an object: compress its serialized bytes with zlib and write them to the fan-out path. This one function stores blobs today and every other object type later, so we make it generic from the start.'
goal: 'Compress and store a serialized object, returning its id.'
spec:
  scenario: An object is compressed and written under its id
  status: failing
  lines:
    - kw: Given
      text: 'an initialised repository and the content hello and a newline'
    - kw: When
      text: 'WriteObject(blob, content) stores it'
    - kw: Then
      text: 'it returns ce013625030ba8dba906f756967f9e9ca394464a and a file exists at objects/ce/013625030ba8dba906f756967f9e9ca394464a'
    - kw: And
      text: 'reading that file and zlib-inflating it yields exactly the serialized bytes blob 6 NUL hello newline, and writing the same content again is a harmless no-op that returns the same id'
code:
  lang: go
  source: |
    // deflate the serialized bytes with zlib, write to the fan-out path
    func (r *Repo) WriteObject(typ string, content []byte) (string, error) {
      data := Serialize(typ, content)
      id := HashObject(typ, content)
      // zlib.NewWriter -> write data -> close; MkdirAll the dir; write file
      // skip the write if the file already exists (same id => same bytes)
      return id, nil
    }
checkpoint: 'You can store any object in the database and read its bytes back. Commit and stop here.'
---

Git compresses every loose object with **zlib** before writing it, so the file on
disk is the deflated form of the serialized bytes. We store it at the fan-out
path from the last lesson. Because the id is a hash of the content, an object is
**immutable**: if a file already exists at that path it holds identical bytes, so
re-writing is a no-op. That is why staging the same file twice costs nothing.

This is also where a small **repository handle** earns its place: a value holding
the repository root so that reads and writes know where the object database is.
Introduce it now (an `Open(root)` that returns it, say) and thread it through
every store operation from here on. Notice too that we made `WriteObject` take a
**type** rather than hard-coding `blob`. Trees and commits are stored by this
exact same function later; only the type word and content differ. We use the
standard library's zlib here as plumbing, the same way
we lean on SHA-1 - the lesson is the store, not the compression. Do not pin the
exact compressed bytes: zlib's output depends on the compression level, so we
assert on the bytes we get back after inflating, which are always the serialized
object.
