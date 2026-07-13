---
project: build-a-compression-tool
lesson: 13
title: The single-symbol edge
overview: An input of one repeated byte breaks the tree - a lone leaf has depth zero, and a zero-length code encodes nothing. Today you pin that edge, forcing a one-bit code so even the most degenerate input has a usable codec.
goal: Give the sole symbol of a single-symbol input a code length of 1.
spec:
  scenario: A one-symbol alphabet still gets a real code
  status: failing
  lines:
    - kw: Given
      text: 'the input AAAA, whose only symbol is A'
    - kw: When
      text: 'code lengths are computed'
    - kw: Then
      text: 'A has code length 1, not 0'
    - kw: And
      text: 'a two-symbol input like AAB gives A and B each length 1, so a length of 1 is the floor for any symbol that appears'
code:
  lang: go
  source: |
    // after building the tree, if there is exactly one distinct symbol,
    // its natural depth is 0 (the root leaf) - a code with no bits.
    // special-case it: force length 1 so it can actually be written and read.
    if len(freq) == 1 {
      // set that symbol's length to 1
    }
checkpoint: Even a single-symbol input has a writable, readable code. Commit and stop here.
---

The tree builder has one blind spot. If the input is a single repeated byte, the
tree is just one leaf, and that leaf's depth is `0` - a code of **zero bits**. You
cannot write zero bits and you cannot read them back, so the codec would silently
lose the symbol count. This is exactly the kind of boundary a spec must pin rather
than discover in production.

The fix is a one-line special case: when the alphabet has exactly one symbol,
force its code length to `1`. Now the symbol has a real one-bit code, and the
decoder, told how many symbols to expect, reads that bit that many times. The
contrast case keeps it honest: an input with two symbols, like `AAB`, already
gives each of `A` and `B` a length-1 code the normal way - so a code length of
`1` is the natural floor for any symbol that appears at all, and the single-symbol
case is just making the degenerate input reach that same floor.
