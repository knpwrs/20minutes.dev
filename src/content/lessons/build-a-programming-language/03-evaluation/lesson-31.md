---
project: build-a-programming-language
lesson: 31
title: Bindings and the environment
overview: Variables need somewhere to live. Today you build the environment - a name-to-value store - so a let binding can save a value and an identifier can look it up.
goal: Evaluate let bindings into an environment and resolve identifiers by looking them up.
spec:
  scenario: Binding and resolving a variable
  status: failing
  lines:
    - kw: Given
      text: 'the source let a = 5; let b = a; b'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 5'
    - kw: And
      text: 'evaluating let a = 5 * 5; a yields 25'
code:
  lang: go
  source: |
    type Environment struct { store map[string]Object }
    func (e *Environment) Get(name string) (Object, bool) { o, ok := e.store[name]; return o, ok }
    func (e *Environment) Set(name string, val Object) Object { e.store[name] = val; return val }
    // Eval now threads an *Environment; let -> Set, Identifier -> Get
checkpoint: Variables can be bound with let and read back by name. Commit.
---

A **let statement** needs somewhere to put its value, and an identifier needs
somewhere to find it: that shared store is the **environment**, a map from names
to objects. Evaluating `let a = 5` computes `5` and stores it under `"a"`;
evaluating the identifier `a` looks it up and returns the value.

This is the biggest structural change since `Eval` began, because the environment
has to travel with evaluation - every `Eval` call now takes an environment
argument and passes it down. Do that plumbing carefully; it is the same
environment you will *extend* per function call in the closures chapter, which is
the whole mechanism behind local variables and closures. Looking up a name that
was never bound is an error - you will report it cleanly in the next lesson.
