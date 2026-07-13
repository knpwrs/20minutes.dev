---
title: 'Build a CHIP-8 Emulator'
order: 31
lessons: 34
size: 'Small'
tech: ['Bytecode interpreters', 'Fetch-decode-execute', 'Sprite rendering']
estMin: 20
desc: 'Build a working CHIP-8 interpreter from first principles - the classic 1970s virtual machine that runs games like Pong and Space Invaders as tiny two-byte opcodes. Start with the machine itself (4KB memory, sixteen registers, the index register, program counter, call stack, timers, a 64x32 monochrome framebuffer, and the built-in hex font), build a fetch-decode-execute cycle, then implement the full opcode set one instruction at a time with every carry, borrow, and shift quirk pinned to an exact value, ending in an emulator that loads a real ROM and runs it to completion.'
blurb: 'The whole CPU core is deterministic, so every lesson is one concrete spec with exact register, memory, and framebuffer values: 7XNN adding past 0xFF wraps to 0x00 without touching VF, 8XY4 setting the carry flag after the store even when X is VF, 8XY5 setting VF to 1 when there is no borrow, 8XY6 shifting a bit out into VF, DXYN drawing a sprite by XOR and flagging a collision, and FX33 splitting 254 into the digits 2, 5, 4. Each opcode is a small checkable target you can assert without ever running a graphical program.'
overview: |
  Over 34 lessons you build a working CHIP-8 emulator from scratch: the interpreter for a tiny 1970s virtual machine whose programs are streams of two-byte opcodes. Because the whole machine is deterministic - 4KB of memory, sixteen 8-bit registers, a 64x32 monochrome screen - every step is exactly testable, so you assert real register and framebuffer values at each lesson rather than eyeballing a running game.

  You start by modelling the machine: its memory, the V0-VF registers, a framebuffer, and the built-in hex font. Then you build the fetch-decode-execute cycle that reads a two-byte opcode, advances the program counter, and decodes it by nibbles. On top of that you implement the full opcode set one instruction per lesson - jumps, subroutine calls through the stack, conditional skips, the 8XY_ ALU with its exact carry, borrow, and shift semantics, the DXYN XOR sprite draw with its collision flag, the hex keypad, the delay and sound timers, and the FX memory operations - pinning every quirk (which flag is written, whether the index register moves) to a concrete value. The capstone loads a small embedded ROM and runs it to completion, asserting the exact pixels it draws.

  This is a teaching-grade emulator built around the standard CHIP-8 instruction set: it runs classic asset-free ROMs (the IBM-logo program and similar display-driven ROMs) and renders the 64x32 display to your terminal. It is honest about its limits - it implements original CHIP-8, not the SUPER-CHIP or XO-CHIP extensions, models sound as a counting-down timer rather than audio output, and does not aim for cycle-exact hardware timing, and the bundled terminal front end is display-only (no real keyboard is wired in, so input-driven games are watched rather than played) - which is exactly the honest core that full emulators extend with higher resolutions, real input, audio, and precise timing.
parts:
  - name: 'The CHIP-8 machine'
    count: 5
  - name: 'Fetch, decode, execute'
    count: 6
  - name: 'Jumps, calls, and skips'
    count: 6
  - name: 'The ALU'
    count: 6
  - name: 'Display, input, and timers'
    count: 6
  - name: 'Memory ops and the capstone'
    count: 5
caveats:
  note: 'The interpreter implements the full standard CHIP-8 instruction set correctly with every quirk pinned, but the bundled terminal front end is display-only: no real keyboard input, no audio, and no cycle-accurate timing, so many real games can be watched but not played as shipped.'
  future:
    - 'Wire up real keyboard input (a terminal raw-mode reader mapped to the 16-key hex keypad) so input-driven games become playable'
    - 'Add real 60Hz frame pacing with live terminal redraw instead of printing one final static frame per run'
    - 'Add audio output (even a simple beep) driven by the sound timer counting down'
    - 'Support loading ROMs from stdin or a URL and embed a few more public-domain test ROMs to run out of the box'
    - 'Run the Timendus CHIP-8 test-suite ROMs and add a quirks-configuration flag so the shift, jump-offset, and FX55/FX65 behaviours can be toggled per ROM'
    - 'Extend to SUPER-CHIP (128x64 hi-res, scrolling, the extra opcodes) once standard CHIP-8 is solid'
resources:
  - title: "Cowgod's Chip-8 Technical Reference v1.0"
    author: 'Thomas P. Greene'
    url: 'http://devernay.free.fr/hacks/chip8/C8TECH10.HTM'
    note: 'The canonical opcode-by-opcode reference: memory map, register set, and the precise behaviour of every instruction. Keep it open the whole project - it is where the exact values in these specs come from.'
  - title: 'Guide to making a CHIP-8 emulator'
    author: 'Tobias V. Langhoff'
    url: 'https://tobiasvl.github.io/blog/write-a-chip-8-emulator/'
    note: 'A modern, beginner-friendly walkthrough that explains the fetch-decode-execute loop and, crucially, the ambiguous quirks (shift, jump-with-offset, the FX55/FX65 index increment) and how to pick one - the same quirks this project pins.'
  - title: 'Mastering CHIP-8'
    author: 'Matthew Mikolay'
    url: 'https://github.com/mattmikolay/chip-8/wiki/Mastering-CHIP%E2%80%908'
    note: 'A concise opcode reference and instruction-set overview - a second, independent description of each instruction to cross-check against Cowgod when a behaviour looks ambiguous.'
  - title: 'CHIP-8 test suite'
    author: 'Timendus'
    url: 'https://github.com/Timendus/chip8-test-suite'
    note: 'A collection of test ROMs that exercise the opcodes, flags, and quirks one by one - the correctness harness to run once your emulator boots, especially the flags and quirks tests.'
  - title: 'Awesome CHIP-8'
    url: 'https://chip-8.github.io/links/'
    note: 'A curated index of CHIP-8 references, ROM archives, and other emulator writeups - where to find asset-free public-domain ROMs (IBM logo, Pong, Tetris) to feed your finished interpreter.'
---
