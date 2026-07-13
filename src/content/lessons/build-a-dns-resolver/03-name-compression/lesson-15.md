---
project: build-a-dns-resolver
lesson: 15
title: Guarding against pointer loops
overview: A malicious or corrupt message can point a name back at itself, and a naive decoder would follow it forever. Today you add the guard that turns an infinite loop into a clean error - the difference between a toy and a safe parser.
goal: Reject a name whose pointers form a loop instead of looping forever.
spec:
  scenario: A pointer loop is rejected, not followed forever
  status: failing
  lines:
    - kw: Given
      text: 'a message where offset 0 is the pointer C0 00 (a pointer to itself)'
    - kw: When
      text: 'a name is decoded starting at offset 0'
    - kw: Then
      text: 'decoding returns an error rather than looping forever'
    - kw: And
      text: 'a two-step cycle (offset 0 is C0 02, offset 2 is C0 00) is also rejected with an error'
code:
  lang: go
  source: |
    // cap how many pointer jumps a single name may take, or record
    // visited offsets and fail if one repeats
    jumps := 0
    if isPointer(b[i]) {
      jumps++
      if jumps > maxJumps { // no legit name needs many pointers
        return "", 0, errPointerLoop
      }
      // ...follow the pointer
    }
checkpoint: Pointer loops are rejected safely. Commit and stop here.
---

Compression pointers only ever point **backward** to earlier bytes in a valid
message, so a well-formed name terminates. But you cannot trust the bytes on the
wire: a corrupt or hostile message can make a pointer target itself, or two
pointers chase each other in a cycle. A decoder that blindly follows would spin
forever, and a parser that hangs on bad input is a denial-of-service waiting to
happen.

The fix is a **bound on jumps**. Either count pointer follows and fail once they
exceed a small cap (a real name needs only a handful), or remember every offset you
have jumped to and error out if one repeats. Both turn an unbounded loop into a
clean `errPointerLoop`. Reporting an error means the decoder now needs a way to
return one, so this is the lesson where `decodeName` grows an error result (its
signature becomes name, consumed, error); update the earlier callers to thread that
error through. This guard is small but essential - it is the line between a decoder
that works on friendly test data and one you could point at the real internet.
