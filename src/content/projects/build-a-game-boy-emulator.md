---
title: 'Build a Game Boy Emulator'
order: 5
lessons: 60
size: 'Large'
tech: ['Opcodes', 'PPU']
estMin: 20
desc: 'Emulate the CPU, memory map, and pixels of real handheld hardware.'
blurb: 'Bring the Sharp LR35902 back to life. Each opcode, flag, and pixel comes with a spec checked against known-good values, so bugs surface the day you write them - not hours into a game. You finish with a working core that boots a real ROM into its main loop and draws the screen.'
overview: |
  Over the next 60 lessons you'll build a working Game Boy core in the language of your choice, one small piece at a time. You start with the CPU's registers and memory, teach it arithmetic and the flags that make games behave, then layer on control flow, bit operations, and the cartridge, then interrupts, timing, and the picture-processing unit that draws a frame, filling in enough of the instruction set that a real cartridge boots and reaches its main loop, and finally wiring the picture and input through their hardware registers so the ROM's own graphics and controls come alive.

  Every lesson is a single ~20-minute session anchored to a concrete spec with known-good values, and each lesson's code runs. What you end with is a genuine, runnable DMG core that executes nearly the full instruction set, boots a real cartridge, renders the background it chooses (scrolled, palettised) with its sprites, and responds to the buttons, not a polished emulator that plays any commercial game front to back. The “Scope & extensions” section below is honest about where it stops and what to build next.
parts:
  - name: 'CPU registers & memory'
    count: 8
  - name: 'Arithmetic & flags'
    count: 9
  - name: 'Control flow'
    count: 10
  - name: 'Bit ops & the cartridge'
    count: 10
  - name: 'Interrupts, timing & graphics'
    count: 11
  - name: 'Booting a real ROM'
    count: 6
  - name: 'Making the picture real'
    count: 6
caveats:
  note: 'Far more than a boot-loop core: the CPU opcode table is essentially complete, and the picture now scrolls and palettises with live sprites while the controller answers input and the timer and joypad raise their interrupts. It still stops short of a general-purpose Game Boy, there is no LCD STAT or window layer, no sprite priority or 8x16 mode, no OAM DMA, only MBC1, and no sound. Those are the next climb, not the core.'
  future:
    - 'Add LCD STAT (the mode flag, the LYC=LY coincidence, and its interrupt), which many games rely on for raster effects and safe VRAM/OAM access.'
    - 'Add the window layer, the sprite background-priority bit, and 8x16 sprite mode.'
    - 'Implement OAM DMA (0xFF46) so ROMs can refresh sprites the usual way instead of writing OAM by hand.'
    - 'Support more cartridge mappers (MBC1 RAM banking, MBC3 with a real-time clock, MBC5) plus battery-backed saves.'
    - 'Move toward cycle-accurate PPU mode timing (OAM scan / draw / HBlank) instead of an end-of-frame sync.'
    - 'Add sound - the APU.'
resources:
  - title: 'Pan Docs'
    url: 'https://gbdev.io/pandocs/'
    note: 'The community-maintained technical reference for Game Boy hardware - the closest thing to an official spec.'
  - title: 'Game Boy CPU opcode table'
    url: 'https://www.pastraiser.com/cpu/gameboy/gameboy_opcodes.html'
    note: 'Every opcode with its operands, flag effects, and cycle counts laid out on a single page.'
  - title: 'The Ultimate Game Boy Talk'
    author: 'Michael Steil'
    url: 'https://media.ccc.de/v/33c3-8029-the_ultimate_game_boy_talk'
    note: 'A 33c3 conference talk covering the CPU, PPU, and memory map end to end, the best single overview of the hardware.'
  - title: 'Mooneye GB Test ROMs'
    url: 'https://github.com/Gekkio/mooneye-test-suite'
    note: 'Cycle-accurate test ROMs used to verify CPU and timing correctness against real hardware behavior.'
  - title: "Blargg's Test ROMs"
    url: 'https://github.com/retrio/gb-test-roms'
    note: 'The long-standing test suite for CPU instruction and timing correctness that most emulator projects validate against.'
---
