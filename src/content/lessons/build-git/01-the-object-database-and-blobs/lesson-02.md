---
project: build-git
lesson: 2
title: 'The loose object format'
overview: 'Before an object can be hashed or stored, Git wraps its contents in a tiny header that records the object''s type and size. Getting these bytes exactly right is what makes our hashes match real Git, so today you build that serialization.'
goal: 'Serialize a piece of content into Git''s loose object format, a header followed by the content.'
spec:
  scenario: Content is wrapped in a type-and-size header
  status: failing
  lines:
    - kw: Given
      text: 'the content is the 6 bytes hello followed by a newline'
    - kw: When
      text: 'it is serialized as a blob with Serialize(blob, content)'
    - kw: Then
      text: 'the result is the bytes of the word blob, a space, the digit 6, a NUL (zero) byte, then the content'
    - kw: And
      text: 'in hex that is 62 6c 6f 62 20 36 00 68 65 6c 6c 6f 0a, and serializing empty content as a blob gives blob, space, 0, NUL'
code:
  lang: go
  source: |
    // header is "<type> <size>\0", then the raw content
    func Serialize(typ string, content []byte) []byte {
      header := fmt.Sprintf("%s %d\x00", typ, len(content))
      return append([]byte(header), content...)
    }
checkpoint: 'You can wrap any content in Git''s loose object header. Commit and stop here.'
---

Every object Git stores, whatever its type, is serialized the same way: a short
header of `"<type> <size>"` then a single **NUL byte** (a zero byte) then the raw
content. The type is a word like `blob`, `tree`, or `commit`; the size is the
length of the content in bytes as decimal ASCII digits. For our file `hello.txt`
holding `hello\n` (5 letters plus a newline, so 6 bytes) the header is
`blob 6` then a zero byte.

This wrapper is the whole reason our hashes will match real Git: the hash is
taken over these exact bytes, header and all, not over the file content alone.
The size and the NUL separator are what let a reader split the header back off
later. Keep this a pure function that takes a type and content and returns the
serialized bytes; nothing is written to disk yet.
