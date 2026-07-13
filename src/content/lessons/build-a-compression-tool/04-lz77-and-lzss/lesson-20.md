---
project: build-a-compression-tool
lesson: 20
title: Tokenizing into literals and matches
overview: LZSS refines LZ77 with a simple rule - emit a back-reference only when it actually pays, otherwise emit a literal. Today you turn an input into a stream of literal and match tokens.
goal: Walk the input, emitting a match token when a match is long enough, else a literal, advancing past what you emit.
spec:
  scenario: An input becomes a token stream
  status: failing
  lines:
    - kw: Given
      text: 'the input ABCABCD'
    - kw: When
      text: 'the input is tokenized with a minimum match length of 3'
    - kw: Then
      text: 'the tokens are Literal A, Literal B, Literal C, Match(offset 3, length 3), Literal D'
    - kw: And
      text: 'the match advances the position by its length, so the trailing D is the only byte after it'
code:
  lang: go
  source: |
    // at each position, try findMatch; emit a Match if length >= MIN_MATCH,
    // else a Literal. advance by the match length, or by 1 for a literal.
    for pos < len(data) {
      off, n := findMatch(data, pos)
      if n >= MIN_MATCH { emit(Match{off, n}); pos += n } else { emit(Literal(data[pos])); pos++ }
    }
checkpoint: An input tokenizes into literals and matches. Commit and stop here.
---

Plain LZ77 emits a token at every position, but a short match can cost more to
describe than the bytes it replaces. **LZSS** fixes this with a threshold: only
emit a **match** when it is at least `MIN_MATCH` bytes long (we use `3`);
otherwise emit a **literal** - the single byte, sent as-is. The tokens carry a
one-bit distinction in spirit: literal versus match. That single flag is exactly
what the next chapter turns into two Huffman alphabets.

Tokenizing is a straight walk. At each position, run `findMatch`; if the match
reaches the threshold, emit `Match(offset, length)` and jump the position forward
by `length`; otherwise emit `Literal(byte)` and step forward by one. For
`ABCABCD` the first three bytes have no earlier copy, so they are literals, then
`ABC` at position 3 matches three bytes back, giving `Match(3, 3)` and skipping to
the final `D`. The stream shrank from seven bytes to five tokens - and matches on
truly repetitive data collapse far more.
