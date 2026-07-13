---
project: build-a-chip-8-emulator
lesson: 23
title: CXNN - a random byte
overview: Games need randomness, and CXNN supplies it - a random byte masked by NN. To keep the result exactly testable you feed the machine a random source it can call, so a stubbed source makes the mask assertion deterministic.
goal: Implement CXNN so it sets VX to a random byte ANDed with NN, drawing from an injectable random source.
spec:
  scenario: CXNN masks a byte from the random source
  status: failing
  lines:
    - kw: Given
      text: 'a VM whose random source is stubbed to always return 0xAB, about to execute 0xC00F'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'V0 becomes 0x0B (0xAB AND 0x0F - the low-nibble mask keeps only the low four bits)'
    - kw: And
      text: 'with the same stub, 0xC0F0 gives V0 = 0xA0 (0xAB AND 0xF0)'
code:
  lang: go
  source: |
    type VM struct {
      // ... existing fields ...
      rand func() byte // injectable random source; real runs use a RNG
    }
    case 0xC000:
      x, nn := byte(op>>8&0x0F), byte(op&0x00FF)
      v.V[x] = v.rand() & nn
checkpoint: CXNN sets a register to a masked random byte from an injectable source. Commit and stop here.
---

**`CXNN`** sets `VX` to a **random byte ANDed with `NN`**. The mask is what makes it useful: a game wanting a random value in `0..15` uses `NN = 0x0F` to keep only the low four bits, and `NN = 0xFF` passes the whole random byte through. The randomness comes from a real generator in normal use, but a real generator is exactly what a spec-first lesson can not assert against.

The fix is to make the random source a **replaceable input** to the machine rather than a hardwired call - a function the VM holds and invokes. In tests you install a stub that always returns a known byte (here `0xAB`), which turns `CXNN` into a pure, checkable AND: `0xAB & 0x0F` is `0x0B`, `0xAB & 0xF0` is `0xA0`. This is language-neutral - every language can pass in a fixed-value function - and it verifies the one behaviour that is actually the opcode's own: the masking. In the finished emulator you wire a real seeded generator into that same slot.
