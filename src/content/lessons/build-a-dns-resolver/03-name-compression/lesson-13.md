---
project: build-a-dns-resolver
lesson: 13
title: Following a pointer
overview: A compressed name is read by jumping to the offset the pointer names and decoding the labels found there. Today you extend the name decoder to follow a single pointer, and to report the right consumed length despite the jump.
goal: Decode a name that is a pointer by following it to an earlier offset.
spec:
  scenario: A pointer name decodes to the name at its target
  status: failing
  lines:
    - kw: Given
      text: 'a message holding the name www.example.com at offset 12, and the two bytes C0 0C at offset 40'
    - kw: When
      text: 'a name is decoded starting at offset 40'
    - kw: Then
      text: 'the name is "www.example.com"'
    - kw: And
      text: 'only 2 bytes were consumed at offset 40 (the pointer itself), not the length of the name it points to'
code:
  lang: go
  source: |
    func decodeName(b []byte, off int) (string, int) {
      i := off
      for b[i] != 0 {
        if isPointer(b[i]) {
          // jump to the target; the name there IS this name today
          name, _ := decodeName(b, pointerTarget(b[i], b[i+1]))
          return name, (i + 2) - off // consumed only the 2 pointer bytes
        }
        // ...otherwise read a normal label
      }
    }
checkpoint: You can follow a single pointer to decode a name. Commit and stop here.
---

Following a pointer is a **jump**: when the decoder sees a pointer byte, it reads
the target offset, decodes the name sitting there, and uses that as the rest of the
current name. In the simplest case the whole name is just a pointer - the two bytes
`C0 0C` at offset 40 mean "the name here is whatever is at offset 12," so decoding
at offset 40 yields `www.example.com` by reading the labels stored back at offset
12.

The subtlety that trips people up is the **consumed length**. The name lives at
offset 12, but at offset 40 you only spent the **two pointer bytes** - so the
caller advancing through the message at offset 40 must move forward by 2, not by
the seventeen bytes of the name it borrowed. A pointer always ends the current
name (there is nothing after it), so returning a consumed length of 2 the moment
you follow one keeps the outer parser aligned. Partial names and pointer chains
build on exactly this.
