---
project: build-a-compression-tool
lesson: 21
title: Expanding tokens back to bytes
overview: A token stream is only compression if it reverses. Today you write the LZSS decoder - literals append, matches copy back-references from what you have already produced - and confirm the round trip.
goal: Decode a token stream to bytes by appending literals and copying matches, and show the round trip holds.
spec:
  scenario: Tokens expand back to the original
  status: failing
  lines:
    - kw: Given
      text: 'the tokens Literal A, Literal B, Literal C, Match(offset 3, length 3), Literal D'
    - kw: When
      text: 'they are decoded'
    - kw: Then
      text: 'the output is ABCABCD'
    - kw: And
      text: 'for any input, decode(tokenize(input)) equals input'
code:
  lang: go
  source: |
    func decode(tokens []Token) []byte {
      var out []byte
      for _, t := range tokens {
        if t.isLiteral { out = append(out, t.b); continue }
        start := len(out) - t.offset       // where the earlier copy begins
        for k := 0; k < t.length; k++ { out = append(out, out[start+k]) }
      }
      return out
    }
checkpoint: The LZSS token codec round-trips. Commit and stop here.
---

Decoding rebuilds the output as it goes, and each token reads from what is already
there. A **literal** appends its byte. A **match** says "go back `offset` bytes
and copy `length` of them," so it computes the start as `len(out) - offset` and
copies from the output buffer onto its own end. For the tokens above, the three
literals build `ABC`, then `Match(3, 3)` copies the three bytes starting three back
- `ABC` again - and the final literal adds `D`, giving `ABCABCD`.

This is the LZSS round trip: `decode(tokenize(input))` returns the original bytes.
It works because the decoder only ever references bytes it has **already
produced** - the window is the output so far. One subtlety is lurking: what if a
match's length reaches past where it started, so it copies bytes the same match is
still writing? That overlap case is real and useful, and it is exactly the next
lesson.
