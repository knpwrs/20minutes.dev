---
project: build-a-type-checker
lesson: 12
title: Types you do not know yet
overview: Inference means working out a type nobody wrote down, so you need a way to stand for an unknown type. Today you add the type variable and a supply of fresh ones - the placeholder the whole inference engine reasons about.
goal: Represent a type variable, generate fresh ones, and compare and print them.
spec:
  scenario: Fresh, distinct, comparable type variables
  status: failing
  lines:
    - kw: Given
      text: 'type variables identified by a number, and a supply of fresh ones'
    - kw: When
      text: variables are generated, compared, and printed
    - kw: Then
      text: 'two calls to the fresh-variable supply return type variables that are not equal to each other'
    - kw: And
      text: 'a variable equals another variable with the same id but not one with a different id, a variable does not equal Int, and the variable with id 0 prints as "a" and id 1 prints as "b"'
code:
  lang: go
  source: |
    // a type variable stands for an unknown type, tagged by a unique id.
    type TVar struct{ Id int }
    var counter int
    func fresh() TVar { t := TVar{counter}; counter++; return t }
    // Equal: two variables match iff same Id.
    // String: print id 0 as "a", 1 as "b", ... (rune 'a'+Id).
checkpoint: You can mint fresh, distinct type variables and compare and print them. Commit and stop here.
---

Every rule so far read a type off something already known: a literal, an
annotation, an environment entry. Inference is the opposite move - you meet an
expression whose type nobody stated, and you have to **discover** it. The tool that
makes this possible is the **type variable**: a stand-in, "some type I do not know
yet", that you can carry around and later pin down. A lambda with no annotation gets
a fresh variable for its parameter; unification then fills it in from how the
parameter is used.

The only requirements today are that each variable is **distinct** and that you can
tell two apart, so a variable is just a unique id. A small `fresh` supply hands out
a new one each time, and `Equal` treats two variables as the same exactly when their
ids match. Printing them as letters - `a`, `b`, `c` - is a nicety that pays off at
the end, when the checker shows a polymorphic type like `a -> a` back to the reader.
This placeholder is the single idea the entire inference core is built on.
