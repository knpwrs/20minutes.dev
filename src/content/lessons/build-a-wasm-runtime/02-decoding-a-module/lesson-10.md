---
project: build-a-wasm-runtime
lesson: 10
title: The export section
overview: 'A module keeps its functions private unless it explicitly exports them by name. Today you decode the export section so a host can later ask for a function by the name the module published.'
goal: Decode the export section into a list of named exports, each with its kind and index.
spec:
  scenario: Decoding a named function export
  status: failing
  lines:
    - kw: Given
      text: 'an export section whose payload is 01 03 61 64 64 00 00 (one export)'
    - kw: When
      text: the export section is decoded
    - kw: Then
      text: 'the result is one export with name "add", kind function, and index 0'
    - kw: And
      text: 'the name is a length-prefixed UTF-8 byte string: 03 61 64 64 is the three bytes for "add"'
code:
  lang: go
  source: |
    // An export is: name (a vec of UTF-8 bytes), a kind byte, and an index.
    // Kind 0x00 = func, 0x01 = table, 0x02 = mem, 0x03 = global.
    type Export struct{ Name string; Kind byte; Index uint32 }
    func readExport(c *Cursor) (Export, error) {
      // name = readVec(readByte) turned into a string; then kind byte; then index
    }
checkpoint: You can read a module's public names and what they point to. Commit and stop here.
---

The **export section** (id `7`) is a module's public interface: a vector of **exports**, each pairing a **name** with something inside the module. An export record is a name, then a one-byte **kind** (`0x00` function, `0x01` table, `0x02` memory, `0x03` global), then an **index** into that kind's space. So `01 03 61 64 64 00 00` is one export named `add` (three bytes `61 64 64`), kind function, index `0`.

The name itself is worth a close look: it is a `vec` of bytes, a `u32` length followed by that many UTF-8 bytes - the same vector pattern again, now producing a string. This is the surface a host reaches through: when your runtime later runs an exported function, it will look the name up here to find which function index to invoke. Decode all four kinds even though you will mostly use functions; a real module exports memories and globals too, and skipping the kind byte wrong would desynchronize the whole section.
