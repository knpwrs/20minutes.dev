---
project: build-git
lesson: 6
title: 'Reading an object and verifying it'
overview: 'Reading is writing in reverse: find the file, inflate it, and recover the serialized bytes. Because the id is a hash of those bytes, we can re-hash what we read and prove the object is not corrupt.'
goal: 'Read a stored object''s raw serialized bytes back and verify its id.'
spec:
  scenario: A stored object round-trips and verifies
  status: failing
  lines:
    - kw: Given
      text: 'a repository holding the blob ce013625030ba8dba906f756967f9e9ca394464a'
    - kw: When
      text: 'ReadRaw(id) reads the file at its fan-out path and zlib-inflates it'
    - kw: Then
      text: 'it returns the serialized bytes blob 6 NUL hello newline'
    - kw: And
      text: 'if the inflated bytes do not hash back to the requested id, ReadRaw returns a corruption error instead of the bytes'
code:
  lang: go
  source: |
    // read file at ObjectPath(id), zlib-inflate, then re-hash to verify
    func (r *Repo) ReadRaw(id string) ([]byte, error) {
      // open the fan-out file, wrap in zlib.NewReader, io.ReadAll
      // recompute sha1(inflated); if hex != id, return a corruption error
    }
checkpoint: 'You can read a stored object back and detect corruption. Commit and stop here.'
---

To read an object we reverse the write: locate its file at the fan-out path,
zlib-**inflate** it, and we are holding the serialized bytes again. Those bytes
still carry their header and NUL, so they are exactly what we hashed when we
stored them. That gives us a free integrity check: hash the inflated bytes and
compare against the id we were asked for. If they differ, the file on disk has
been damaged and we refuse it rather than hand back bad data.

This verify-on-read is a real property of content-addressable storage, not busy
work: because the name of a thing is the hash of the thing, corruption cannot hide.
Next lesson we split the header back off so a caller gets a clean type, size, and
content instead of the raw serialized bytes.
