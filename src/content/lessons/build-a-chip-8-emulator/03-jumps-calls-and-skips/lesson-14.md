---
project: build-a-chip-8-emulator
lesson: 14
title: 2NNN - call a subroutine
overview: A call is a jump that leaves a breadcrumb - it saves the return address before redirecting. Today you implement 2NNN, which pushes the current PC onto the stack and jumps to NNN.
goal: Implement 2NNN so it pushes the return address and jumps to NNN.
spec:
  scenario: 2NNN saves the return address and jumps
  status: failing
  lines:
    - kw: Given
      text: 'a VM about to execute 0x2400 at address 0x200'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'PC becomes 0x400 and the address 0x202 (the instruction after the call) is on top of the stack'
    - kw: And
      text: 'the stack now holds exactly one entry'
code:
  lang: go
  source: |
    case 0x2000:
      // PC has already advanced past the call by Fetch, so pushing
      // it now saves the address to resume at
      v.push(v.pc)
      v.pc = op & 0x0FFF
      return nil
checkpoint: 2NNN calls a subroutine, saving the return address on the stack. Commit and stop here.
---

**`2NNN`** calls the subroutine at address `NNN`. It is exactly like a `1NNN` jump but with one extra step first: it **pushes the return address** onto the stack so the subroutine can come back. The elegant part is the timing - `Fetch` already advanced `PC` past the call instruction, so at the moment you push, `PC` points at the *next* instruction, which is precisely where execution should resume after the subroutine returns.

So the whole opcode is: push `PC`, then set `PC` to `NNN`. Notice how the walking-skeleton design pays off - because fetch advances first and the stack already works, the call is two lines. The test pins the crucial value: after calling from `0x200`, the saved address must be `0x202` (the byte after the two-byte call), not `0x200`, or the eventual return would loop back onto the call and hang.
