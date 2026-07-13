---
project: build-a-wasm-runtime
lesson: 41
title: Trapping cleanly
overview: 'An indirect call can go wrong three ways, and a runtime must turn each into a clean trap, not a crash. Today you give traps a carried message and surface them from an indirect call gone bad.'
goal: Make call_indirect trap with a clear message on an out-of-range index, an empty slot, or a type mismatch.
spec:
  scenario: Trapping on a bad indirect call
  status: failing
  lines:
    - kw: Given
      text: a table of 2 slots with function 0 at slot 0 and slot 1 left empty
    - kw: When
      text: call_indirect is given a bad index
    - kw: Then
      text: 'an index of 2 (past the table) traps, an index of 1 (an empty slot) traps, and an index whose function has the wrong type traps'
    - kw: And
      text: 'each trap carries a message and is returned from invoke as an error, never a host-language panic or crash'
code:
  lang: go
  source: |
    // A Trap is a value carrying why execution stopped. invoke returns it as an
    // error; it never panics the host.
    type Trap struct{ Msg string }
    func (t *Trap) Error() string { return "trap: " + t.Msg }
    // in call_indirect:
    if slot < 0 || slot >= len(table.Funcs) { return &Trap{"undefined element: index out of bounds"} }
    if table.Funcs[slot] < 0            { return &Trap{"uninitialized element"} }
    if actualType != expectedType       { return &Trap{"indirect call type mismatch"} }
checkpoint: The engine turns bad indirect calls into clean, described traps. Commit and stop here.
---

A **trap** is WebAssembly's controlled failure: execution stops and unwinds, but the host stays healthy. You have raised traps already - `unreachable`, divide-by-zero, an out-of-range conversion - and now is the moment to make them a proper carried value with a **message**, because `call_indirect` is where a trap is most likely and most informative. Three things can go wrong, and each must be a distinct trap: the index can be **out of range** (past the table's end), the slot can be **empty** (no function was ever placed there), or the function found can have the **wrong type** (the run-time check from the last lesson fails).

The rule that matters is that all three become a clean `Trap` **returned from invoke**, never a host-language panic that takes the process down. This is the difference between a runtime and a toy: a real module handed bad data must fail predictably, with a message a caller can log ("undefined element: index out of bounds"), and leave the engine ready to run again. Make the trap a value your interpreter loop returns, and let `Invoke` hand it back to the host. Exercise each of the three cases against a table with a filled slot and an empty one to see the traps fire instead of a crash - that graceful failure is the property the finalize pass depends on for every unimplemented opcode too.
