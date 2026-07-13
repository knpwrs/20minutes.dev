---
project: build-a-wasm-runtime
lesson: 16
title: Invoking an exported function
overview: 'You can decode a module and you can run instruction bytes; today you connect them. This is the walking skeleton: look up an exported function by name, run its body, and return the result.'
goal: Invoke an exported function by name, running its code body and returning the value it leaves on the stack.
spec:
  scenario: Running an exported function end to end
  status: failing
  lines:
    - kw: Given
      text: 'a decoded module that exports "answer" as a function whose body is 41 2A 0B'
    - kw: When
      text: '"answer" is invoked with no arguments'
    - kw: Then
      text: the call returns the single i32 result 42
    - kw: And
      text: invoking a name that is not exported returns an error
code:
  lang: go
  source: |
    // Invoke joins decoding to execution: find the export, get its code body,
    // run it on a fresh stack, and pop as many results as the type declares.
    func (m *Module) Invoke(name string) ([]Value, error) {
      idx, ok := m.FindExport(name)
      // body := m.Code[idx].Body; run the interpreter loop over it
      // pop m.Types[m.FuncType[idx]].Results results and return them
    }
checkpoint: You can run an exported function from raw module bytes. Commit and stop here.
---

This is the moment the project becomes a **runtime** rather than a decoder. `Invoke` takes a name, uses `FindExport` to turn it into a function index, fetches that function's code body, runs it through the interpreter loop on a fresh value stack, and returns whatever the body left behind. With a body of `41 2A 0B`, invoking `answer` runs `i32.const 42` then `end`, and `42` is sitting on top of the stack when the loop stops.

From here on you have a **walking skeleton**: a real end-to-end path from raw bytes to a returned value, thin but complete. Every later lesson thickens the middle - more opcodes the body can contain, locals, control flow, calls - but the shape stays exactly this. How many results to pop is not a guess: the function's type (via its type index) says how many results it returns, so a `(result i32)` function yields one value. Keeping invoke driven by the declared signature is what will let it handle multi-argument, value-returning functions unchanged later.
