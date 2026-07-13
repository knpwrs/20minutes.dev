---
project: build-a-regex-engine
lesson: 18
title: States and fragments
overview: A new matching engine begins - one built from states and arrows instead of tree-walking. Today you define the state type and compile the simplest pattern, a single character, into a fragment.
goal: Define an NFA State and compile a Literal into a one-state fragment with a dangling exit.
spec:
  scenario: Compiling a single character yields one Char state
  status: failing
  lines:
    - kw: Given
      text: "the AST node Literal 'a'"
    - kw: When
      text: it is compiled into an NFA fragment
    - kw: Then
      text: "the fragment's start is a Char state that matches 'a'"
    - kw: And
      text: the fragment has exactly one dangling exit - the Char state's out arrow, not yet connected
code:
  lang: go
  source: |
    type State struct {
        Kind       int // Char, Split, or Accept (the accepting state)
        Ch         byte
        Out, Out1  *State
    }
    // Name the accepting kind "Accept", not "Match" - some languages
    // already have a Match function and the identifier would collide.
    type Frag struct {
        start *State
        out   []**State // dangling arrows to be patched later
    }
checkpoint: A Literal compiles into a single Char state whose exit dangles, ready to wire up. Commit and stop here.
---

For three lessons you'll build a *second* matcher, and it starts from a different idea:
instead of walking the syntax tree with recursion, you compile the tree into a
**graph of states** connected by arrows, then run input through the graph. This is
**Thompson's construction**, and each piece of syntax becomes a small **fragment** - a
subgraph with one entry point and some **dangling** exit arrows that later steps will
connect to whatever comes next.

The atom of the whole scheme is the `Char` state: it matches one specific byte and
has a single out arrow. When you compile `Literal 'a'`, you get a fragment whose start
*is* that `Char` state, and whose one dangling exit is the state's unconnected `Out`.
Leaving exits dangling - rather than pointing them somewhere immediately - is the key
move: tomorrow's concatenation works precisely by patching one fragment's dangling
exits onto the next fragment's start.
