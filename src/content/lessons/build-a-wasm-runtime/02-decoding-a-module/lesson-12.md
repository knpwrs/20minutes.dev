---
project: build-a-wasm-runtime
lesson: 12
title: Assembling the module
overview: 'You have decoders for each section; now you walk a whole module and collect them into one structure. Today you decode a complete module end to end and look up an exported function by name.'
goal: Decode a full module by dispatching each section to its decoder, then find an export by name.
spec:
  scenario: Decoding a whole module and looking up an export
  status: failing
  lines:
    - kw: Given
      text: 'a complete module with a type (i32)->(i32), one function of that type, an export "add" for function 0, and a code body'
    - kw: When
      text: the module is decoded and "add" is looked up
    - kw: Then
      text: 'the module holds 1 type, 1 function, 1 export, and 1 code body, and looking up "add" returns function index 0'
    - kw: And
      text: looking up a name that is not exported reports that it was not found
code:
  lang: go
  source: |
    // Read the preamble, then loop reading section frames. Dispatch on the id:
    // 1 -> types, 3 -> functions, 7 -> exports, 10 -> code; 0 (custom) is skipped.
    type Module struct {
      Types    []FuncType
      FuncType []uint32
      Exports  []Export
      Code     []Code
    }
    func (m *Module) FindExport(name string) (uint32, bool) { /* scan Exports */ }
checkpoint: You can decode a real module from raw bytes and find its exports. Commit and stop here.
---

Everything so far has decoded one section in isolation; today you drive the whole walk. After the eight-byte preamble, a module is a run of section frames in ascending id order, so the decoder is a loop: read a frame, switch on its **id** to the matching decoder from the last five lessons, and store the result on a `Module`. Ids you do not handle - custom sections (id `0`) especially - are skipped by their size, exactly as the framing lesson set up. When the bytes run out, the module is fully decoded.

This is the first lesson where the pieces become a **thing you can inspect**: a `Module` with its types, function-to-type links, exports, and code bodies all in one place. `FindExport` is the small but important join - it turns a name a host cares about (`"add"`) into the function index the engine will run. That lookup is the doorway the next chapter walks through: once you can execute instructions, invoking an export is "find the index here, run that code body". Print a short summary of a decoded module to see it working end to end.
