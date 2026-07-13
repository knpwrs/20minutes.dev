---
project: build-a-wasm-runtime
lesson: 11
title: The code section
overview: 'A function''s body - its local variables and its instructions - lives in the code section. Today you decode one function body: its declared locals and the raw bytes of its instructions, which the engine will run later.'
goal: Decode a code-section entry into its list of local types and the raw bytes of its instruction sequence.
spec:
  scenario: Decoding a function body
  status: failing
  lines:
    - kw: Given
      text: 'a code section whose payload is 01 06 01 01 7F 41 2A 0B (one body of size 6)'
    - kw: When
      text: the code section is decoded
    - kw: Then
      text: 'the one body has locals [i32] and instruction bytes 41 2A 0B'
    - kw: And
      text: 'the locals are run-length encoded: 01 01 7F means one group of one i32, expanding to a single i32 local'
code:
  lang: go
  source: |
    // A code entry is: body size (bytes), then locals = vec of (count, valtype)
    // groups, then the rest of the body is the instruction bytes up to its size.
    type Code struct{ Locals []ValType; Body []byte }
    func readCode(c *Cursor) (Code, error) {
      // size := readVarU32; end := c.pos + size
      // for each (count, valtype) group, append count copies of valtype
      // Body = remaining bytes until end
    }
checkpoint: You can decode a function's locals and instruction bytes. Commit and stop here.
---

The **code section** (id `10`) holds the heavy half of each function: its **locals** and its **instructions**. Each entry starts with its own byte **size**, which lets a decoder skip a body it does not want to read and, more usefully, marks exactly where the instruction bytes end. Inside, the locals come first, **run-length encoded**: a vector of `(count, valtype)` groups, so `01 01 7F` is "one group of one `i32`" and a body with fifty `i32` locals costs three bytes, not fifty. You expand each group into that many entries so later `local.get n` has a flat list to index.

After the locals, everything up to the entry's declared size is the **instruction sequence**, ending in the `0x0B` (`end`) opcode. You are not running these bytes yet - the whole next chapter is the engine that does - so today you just capture them as a raw slice. Using the size to bound the body is the safe way to know where one function's code stops and the next begins.
