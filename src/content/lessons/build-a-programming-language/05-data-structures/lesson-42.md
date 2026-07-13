---
project: build-a-programming-language
lesson: 42
title: Built-in functions
overview: Some functionality has to come from the host language - measuring a string's length, printing output. Today you add built-in functions, starting with len, by introducing a builtin object and a registry the evaluator checks before the environment.
goal: Add a built-in function object and implement len, resolving builtins by name.
spec:
  scenario: Calling the built-in len
  status: failing
  lines:
    - kw: Given
      text: 'the source len("hello")'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 5'
    - kw: And
      text: 'len("") is 0, and len(5) yields the error argument to len not supported, got INTEGER'
code:
  lang: go
  source: |
    type Builtin struct { Fn func(args ...Object) Object }
    func (b *Builtin) Type() string { return "BUILTIN" }
    var builtins = map[string]*Builtin{
      "len": {Fn: func(args ...Object) Object { /* one String arg -> its length */ }},
      // "puts" prints each arg's Inspect and returns NULL
    }
    // resolving an identifier: check builtins if the name is not in the environment
checkpoint: The built-in len works, and the builtin mechanism is ready for more. Commit.
---

Some things a program needs cannot be written in the language itself yet -
measuring a value's length, printing to the screen. Those come from **built-in
functions**: a new `Builtin` object wrapping a native (host-language) function,
kept in a small registry keyed by name. When resolving an identifier, check the
environment first and fall back to this registry, so `len` resolves to the builtin
even though no `let` ever bound it.

Start with `len`, which returns the length of a string, and set up the registry so
adding more builtins is trivial - a companion `puts` that prints each argument and
returns `null` gives your programs a way to show output. Builtins validate their
arguments and return a clear **error** on misuse, like `len(5)` reporting an
unsupported argument type - the same error object you built earlier. Arrays, next,
will make `len` and friends far more useful.
