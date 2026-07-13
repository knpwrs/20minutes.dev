---
project: build-a-memory-allocator
lesson: 22
title: Realloc that relocates
overview: When an allocation cannot grow in place, realloc falls back to moving it - allocate a new block, copy the bytes over, free the old one. Today you complete realloc with that relocate-and-copy path.
goal: Relocate a growing allocation that cannot expand in place, preserving its contents.
spec:
  scenario: A growing allocation that cannot expand is moved
  status: failing
  lines:
    - kw: Given
      text: 'a 96-byte heap with (0, 24, allocated), (24, 24, allocated), (48, 48, free), the byte 0xAB stored at offset 8, reallocating the first block (payload 8)'
    - kw: When
      text: 'Realloc(8, 24) is called (needs a 40-byte block, but the next block is allocated)'
    - kw: Then
      text: 'it allocates a new block from the free region and returns a different payload offset, 56'
    - kw: And
      text: 'the contents are copied - the byte at offset 56 is 0xAB - and the old block at 0 is now free'
code:
  lang: go
  source: |
    // fall-through when in-place growth is impossible:
    newPayload, err := a.Malloc(n)      // find space elsewhere
    if err != nil { return -1, err }
    oldPayloadCap := size - overhead
    copy(a.buf[newPayload:newPayload+oldPayloadCap], a.buf[payload:payload+oldPayloadCap])
    a.Free(payload)                     // release the old block
    return newPayload, nil
checkpoint: Realloc is complete - shrink, grow in place, or relocate. Commit and stop here.
---

If an allocation cannot grow where it sits, realloc does what a caller expects: it
finds space elsewhere, copies the old contents into it, releases the old block, and
returns the **new** offset. The copy length is the old payload's capacity, so every
byte the caller had written survives the move. This is the general fallback, and it
is why a realloc'd pointer can change - the classic footgun in C, made explicit here
as a changed offset.

With this, realloc is complete: it shrinks in place, grows in place when a free
neighbour allows, and relocates when it must. Notice how it is assembled entirely
from pieces you already built - `Malloc`, `Free`, and byte copying - which is the
mark of a clean allocator core. One convenience allocation remains before the demo:
`calloc`, which allocates *and* zeroes.
