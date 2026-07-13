---
title: 'Build a WASM Runtime'
order: 14
lessons: 47
size: 'Medium'
tech: ['Stack machine', 'Bytecode interpreters', 'LEB128']
estMin: 20
desc: 'Build a WebAssembly runtime from scratch: decode the binary format (magic, LEB128, sections), build a value stack and a decode-and-execute loop, implement the i32/i64/f32/f64 numeric core, structured control flow with the label and branch-arity model, function calls and call_indirect over a table, linear memory with bounds traps, and globals - then run a real compiled module.'
blurb: 'Start by reading the eight-byte module header and decoding a single LEB128 integer, and end with a runtime that decodes a real compiled `.wasm` module from raw bytes and runs its exported function. Every lesson gives you a concrete spec with exact bytes and expected values to hit - the sign-extension boundary, i32 wraparound, divide-by-zero traps, the block-versus-loop branch target - and the interpreter grows one honest opcode family at a time.'
overview: |
  Over 47 lessons you build a working WebAssembly runtime - an interpreter, not a JIT - that decodes the `.wasm` binary format directly and executes it on a stack machine. You begin at the very first bytes: the `\0asm` magic and version, then LEB128 integer decoding, the section framing, and the type, function, export, and code sections that describe what a module contains. From there you stand up the engine - a value stack and a decode-and-execute loop - and grow the instruction set one family at a time: the full i32 numeric and comparison operations, then i64, f32, and f64; locals and parameters; structured control flow (`block`, `loop`, `if`, `br`, `br_if`, `br_table`) with the label and branch-arity model that trips everyone up; function calls, the call stack, and `call_indirect` through a table; and finally linear memory with alignment, offsets, and bounds traps, plus globals.

  By the end you have a runnable tool: point it at a compiled `.wasm` module, name an exported function, pass arguments, and get the result back - the capstone decodes an iterative factorial module from raw bytes and runs it. Every operation is pinned to exact expected values, including the edges that break naive ports: signed LEB128 sign-extension, i32 wraparound at `0x7FFFFFFF + 1`, division that truncates toward zero, the divide-by-zero and out-of-bounds traps, and the difference between branching to a block and branching to a loop.

  This is a teaching-grade runtime built around WebAssembly's real MVP core: correct enough to decode and run compiled modules that stay within that core, but deliberately stopping short of what a production engine ships - SIMD, threads and atomics, the full WASI host-import surface, bulk-memory operations, exception handling, complete validation, and the WAT text-format parser. What you finish with is the numeric, control-flow, call, and memory core that all of those are built on top of.
parts:
  - name: 'The binary format'
    count: 6
  - name: 'Decoding a module'
    count: 6
  - name: 'A stack machine for i32'
    count: 11
  - name: 'The rest of the numbers'
    count: 6
  - name: 'Structured control flow'
    count: 6
  - name: 'Functions and tables'
    count: 6
  - name: 'Linear memory and globals'
    count: 6
caveats:
  note: 'A genuinely working WebAssembly MVP interpreter that decodes the binary format from raw bytes and runs the core end to end - the full i32/i64/f32/f64 numeric families, structured control flow, direct and indirect calls, and linear memory with bounds traps - behind a runnable CLI whose built-in demo decodes and runs an iterative factorial with no external asset. It stops at the MVP core: no host imports or WASI, minimal validation (it runs correct modules rather than rejecting every malformed one), and no bulk-memory, SIMD, threads, or exception handling.'
  future:
    - 'Add a validation pass so a malformed module fails fast with a clear error instead of trapping or misbehaving partway through execution'
    - 'Support the import section and a minimal host-function ABI so modules can do I/O and call into the host, not just return a value'
    - 'Add the bulk-memory operations (memory.copy, memory.fill) and saturating truncation conversions that real compiler output (Rust, clang) commonly emits'
    - 'Round out the MVP-adjacent instructions this build does not reach, such as tail calls and the typed select'
    - 'Write a WAT text-format parser so modules can be authored as text instead of only hand-assembled bytes or a compiler'
    - 'Extend toward fuller spec coverage: SIMD, threads and atomics, and multiple memories and tables'
resources:
  - title: 'WebAssembly Core Specification'
    url: 'https://webassembly.github.io/spec/core/'
    note: 'The authoritative reference. The Binary Format and Execution sections define every byte and every opcode you decode and run in this project - keep it open as you work.'
  - title: 'MDN: WebAssembly Concepts'
    url: 'https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts'
    note: 'A gentler orientation to what a module is, how the stack machine works, and how host and module fit together - good background before the spec.'
  - title: 'LEB128'
    url: 'https://en.wikipedia.org/wiki/LEB128'
    note: 'The little-endian base-128 variable-length integer encoding that WebAssembly uses everywhere. The unsigned and signed decoders you build in chapter one are exactly this, sign extension and all.'
  - title: 'wazero'
    author: 'Tetrate'
    url: 'https://github.com/tetratelabs/wazero'
    note: 'A zero-dependency WebAssembly runtime written in Go - a readable, production-grade reference for the decoder and interpreter you are building here.'
  - title: 'wasm3'
    url: 'https://github.com/wasm3/wasm3'
    note: 'A small, fast interpreter (not a JIT) for WebAssembly - a good second reference for how a real stack-machine execution loop is structured.'
---
