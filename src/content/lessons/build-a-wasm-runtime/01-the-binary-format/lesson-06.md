---
project: build-a-wasm-runtime
lesson: 6
title: Decoding a vector
overview: 'Almost every list inside a module - the types, the functions, the exports - is stored the same way: a count followed by that many elements. Today you build the one vector-decoding helper the whole next chapter reuses.'
goal: Decode a length-prefixed vector by reading a count and then applying an element decoder that many times.
spec:
  scenario: Reading a count-prefixed vector
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 03 0A 14 1E (a count of 3 followed by three single bytes)'
    - kw: When
      text: the vector is decoded with an element decoder that reads one byte
    - kw: Then
      text: 'the result is the three elements [10, 20, 30] in order, and the cursor sits just past the last element'
    - kw: And
      text: a count of 0 yields an empty vector and consumes only the count byte
code:
  lang: go
  source: |
    // A vec<T> is: count (varuint32), then count elements decoded by readElem.
    // Passing the element decoder in keeps this generic across section types.
    func readVec[T any](c *Cursor, readElem func(*Cursor) (T, error)) ([]T, error) {
      n, err := c.readVarU32()
      if err != nil { return nil, err }
      out := make([]T, 0, n)
      // read n elements, appending each; return them
      return out, nil
    }
checkpoint: You have a reusable vector decoder for every list in a module. Commit and stop here.
---

WebAssembly is relentlessly consistent about lists. A **vector** - written `vec(T)` in the spec - is always a `u32` **count** followed by exactly that many encoded elements, one after another. The type section is a vec of function types, the function section is a vec of type indices, the export section is a vec of exports, a function's locals are a vec, a `br_table`'s targets are a vec. Build the pattern once, correctly, and every one of those becomes a one-line call.

The trick that keeps it reusable is passing in the **element decoder** as a function: `readVec` owns the count-and-loop scaffolding, and the caller supplies "here is how to read one element." Today you test it with a trivial one-byte element so the mechanics are obvious, but the exact same helper will read a whole function type in the next chapter. Pinning the empty-vector case (count `0` reads nothing more) matters because empty sections are common and must not misread the following bytes.
