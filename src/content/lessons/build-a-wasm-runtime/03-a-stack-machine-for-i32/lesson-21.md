---
project: build-a-wasm-runtime
lesson: 21
title: i32 bit counting
overview: 'Three unary instructions count bits: leading zeros, trailing zeros, and total ones. Today you add them and pin how each behaves on zero, the tricky input.'
goal: Execute i32.clz, i32.ctz, and i32.popcnt, each consuming one operand and pushing a count.
spec:
  scenario: Counting bits in a value
  status: failing
  lines:
    - kw: Given
      text: the interpreter with a single i32 operand on the stack
    - kw: When
      text: 'i32.clz, i32.ctz, or i32.popcnt executes'
    - kw: Then
      text: 'clz(1) = 31 (31 leading zeros), ctz(0x80000000) = 31 (31 trailing zeros), and popcnt(0xFFFFFFFF) = 32'
    - kw: And
      text: 'the all-zero input is defined: clz(0) = 32, ctz(0) = 32, and popcnt(0) = 0'
code:
  lang: go
  source: |
    // These are unary: pop one, push a count (0..32). Watch the zero case -
    // clz and ctz both return the full width 32 when there are no set bits.
    case 0x67: // i32.clz
      a := popU32(); stack.Push(I32(int32(bits.LeadingZeros32(a))))
    // 0x68 ctz (trailing zeros), 0x69 popcnt (count of set bits)
checkpoint: The engine counts leading zeros, trailing zeros, and set bits. Commit and stop here.
---

Unlike everything so far, these three are **unary**: they pop one value and push a count. `clz` counts **leading zeros** (from the most significant bit down to the first `1`), `ctz` counts **trailing zeros** (from the least significant bit up), and `popcnt` counts the total number of set bits. They show up in fast implementations of logarithms, alignment math, and bit-set iteration, so a real module will use them.

The input that needs pinning is **zero**. With no bits set, "the number of zeros before the first one bit" has no natural answer, so WebAssembly defines it: `clz(0)` and `ctz(0)` are both `32`, the full width, and `popcnt(0)` is `0`. Many host libraries return the same, but some leave the all-zero case undefined, so it is worth asserting directly. For any nonzero value the counts are unambiguous: `1` has 31 zeros above it, and `0x80000000` has 31 below it.
