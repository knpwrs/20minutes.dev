---
project: build-a-qr-code-encoder
lesson: 4
title: The antilog table
overview: 'The primitive element 2 generates the whole field: its successive powers cycle through all 255 non-zero elements before repeating. Today you tabulate those powers into an antilog table, the lookup that turns exponents back into field elements.'
goal: 'Build a table of the powers of 2 in GF(256) and read back its key entries.'
spec:
  scenario: 'Powers of two cycle through the field'
  status: failing
  lines:
    - kw: Given
      text: 'an antilog table exp where exp[i] is 2 raised to the i-th power in GF(256), built by starting at 1 and doubling'
    - kw: When
      text: 'entries 0, 1, 8, and 254 are read'
    - kw: Then
      text: 'exp[0] is 1, exp[1] is 2, and exp[8] is 29 (0x1D) - the first power that overflowed and reduced'
    - kw: And
      text: 'exp[254] is 142, and continuing one more doubling returns to exp[0]=1, so the powers repeat with period 255'
code:
  lang: go
  source: |
    // exp[i] = 2^i in GF(256). Double from 1; there are 255
    // distinct non-zero powers before the cycle repeats.
    var exp [256]byte
    func init() {
      x := byte(1)
      for i := 0; i < 255; i++ {
        exp[i] = x
        x = xtime(x)
      }
    }
checkpoint: 'You have the antilog table mapping an exponent to a field element. Commit and stop here.'
---

The element `2` is a **primitive element** (also called a generator) of GF(256): raise it to the powers `0, 1, 2, ...` and you sweep through every one of the 255 non-zero elements exactly once before wrapping back to `1`. Building the table is just the doubling you already have, applied 255 times starting from `1`: `exp[0]=1, exp[1]=2, exp[2]=4, ... exp[7]=128, exp[8]=29`. That jump from `128` to `29` is the reduce step from lesson 2 showing up right where you would expect it.

This **antilog table** (also called an exp table) is half of the fast-multiply trick. Because the powers cycle with period `255`, the exponents behave like arithmetic modulo `255`: `2^254` times `2^1` is `2^255` which is `2^0` = `1` again. Some implementations double the table to `512` entries so `exp[i]` is valid for `i` up to `509` and no modulo is needed when you add two exponents; either way, the entry you will lean on hardest is that the sequence has period `255`.
