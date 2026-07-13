---
project: build-a-programming-language
lesson: 33
title: Assignment
overview: A let creates a binding; assignment updates one. Today you evaluate x = value, changing what an existing name points to - the piece a loop needs to make progress.
goal: Evaluate assignment to an existing variable, and error when the name was never bound.
spec:
  scenario: Reassigning a variable
  status: failing
  lines:
    - kw: Given
      text: 'the source let x = 1; x = 2; x'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 2'
    - kw: And
      text: 'assigning to a name that was never bound, as in y = 3, yields the error identifier not found: y'
code:
  lang: go
  source: |
    // parse x = value as an Assignment node (name + value expression)
    // eval: require the name already exists in the environment, then update it
    func (e *Environment) Assign(name string, val Object) bool {
      if _, ok := e.store[name]; !ok { return false }   // not bound -> caller errors
      e.store[name] = val; return true
    }
checkpoint: Assignment updates an existing binding, and assigning an unbound name errors. Commit.
---

`let` and assignment are different operations: `let x = 1` **creates** a new
binding, while `x = 2` **updates** an existing one. Assignment requires the name
to already exist - assigning to an unbound `y` is the same
`identifier not found` error you built last lesson, not a silent new binding.
That distinction keeps typos from quietly creating variables.

You will parse `x = value` as an assignment (an identifier on the left, `=`, and a
value) and evaluate it by updating the environment in place. This is the missing
piece for loops: without reassignment a `while` could never change its condition,
so a counter could never advance. That is exactly what the chapter's final lesson
puts to work.
