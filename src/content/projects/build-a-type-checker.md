---
title: 'Build a Type Checker'
order: 13
lessons: 36
size: 'Medium'
tech: ['Type inference', 'Unification', 'Hindley-Milner']
estMin: 20
desc: 'Build a real type checker for a small functional language from first principles: a type representation and expression AST, an explicitly-typed checker with environments, let-bindings, functions and conditionals, then the inference core - type variables, unification with the occurs check, substitutions, and Hindley-Milner (Algorithm W) let-polymorphism - finishing with tuples, lists, records, located diagnostics, and a capstone that infers the principal type of a program or reports its type error.'
blurb: 'Start with a checker that answers "what type is this?" for literals and end with an inference engine that reads an unannotated program and works out its principal type on its own. Every lesson is one concrete spec: type equality, variable scoping, arrow types, unification, the occurs check that rejects infinite types, generalization so let id = \x.x is polymorphic, and type errors that carry a source location.'
overview: |
  Over 36 lessons you build a working type checker for a small functional language, from the ground up. You start with a representation of types (Int, Bool, String) and a tiny expression AST, and write a checker that answers "what type is this?" for literals, variables in a typing environment, let-bindings with lexical scope, explicitly-typed functions and application, and conditionals - a complete, usable checker for explicitly-typed programs.

  Then you build the inference core that makes the annotations optional: type variables and fresh names, substitutions you can apply and compose, unification of two types, and the occurs check that rejects infinite types like the one hidden in \x. x x. You wire these into Algorithm W - inferring application, lambdas and conditionals by unification, then generalization and instantiation so that let id = \x.x is polymorphic and works at both Int and Bool, while a lambda-bound parameter stays monomorphic. You finish with richer types - arithmetic operators, recursion, tuples, lists, and records - and quality diagnostics: type errors that name the expected and actual types and point at a source position.

  This is a teaching-grade Hindley-Milner checker built around the real Algorithm W design: it infers the principal type of an unannotated program, reports the first type error with a location, and is honest about its edges - it takes a pre-built AST rather than parsing source text, and it reports one type error at a time rather than recovering to collect them all. The capstone infers the principal type of a small polymorphic program and reports the located error in an ill-typed one - the same core that sits inside the type systems of ML, Haskell, and their descendants.
parts:
  - name: 'Types and expressions'
    count: 6
  - name: 'Functions'
    count: 5
  - name: 'The inference toolkit'
    count: 6
  - name: 'Algorithm W and polymorphism'
    count: 7
  - name: 'Richer types'
    count: 8
  - name: 'Diagnostics and the capstone'
    count: 4
caveats:
  note: 'A complete, correctly-threaded Hindley-Milner core - literals through functions, let-polymorphism, tuples, lists, records, arithmetic and recursion, and located type errors - usable as an importable checker API and demonstrated by a runnable demo, but it types a pre-built AST rather than parsing source text, reports one error at a time with no recovery, and stops short of row polymorphism, type classes, user-defined data types, and modules.'
  future:
    - 'Add a lexer and parser so the checker reads source text instead of hand-built ASTs'
    - 'Collect and report every type error in a program instead of stopping at the first'
    - 'Add row-polymorphic (open) records so a function like \x. x.age works on any record that has that field'
    - 'Add user-defined algebraic data types with constructors and pattern matching'
    - 'Add type classes / ad hoc polymorphism so operators can be overloaded once there is more than one numeric type'
    - 'Extend the language with more base types and operators (floats, division, boolean and/or) as in-family additions'
resources:
  - title: 'Types and Programming Languages'
    author: 'Benjamin C. Pierce'
    url: 'https://www.cis.upenn.edu/~bcpierce/tapl/'
    note: 'The standard modern text on type systems. The simply-typed lambda calculus and type-reconstruction chapters cover exactly the explicit checker and the unification-based inference this project builds.'
  - title: 'Principal Type-Schemes for Functional Programs'
    author: 'Luis Damas, Robin Milner'
    url: 'https://dl.acm.org/doi/10.1145/582153.582176'
    note: 'The 1982 paper that introduced Algorithm W and proved it finds the principal type. The generalization and instantiation rules in chapter four come straight from here.'
  - title: 'A Theory of Type Polymorphism in Programming'
    author: 'Robin Milner'
    url: 'https://doi.org/10.1016/0022-0000(78)90014-4'
    note: 'Milner 1978 - the origin of let-polymorphism and the unification-based type discipline. The reason let generalizes and a lambda parameter does not.'
  - title: 'Basic Polymorphic Typechecking'
    author: 'Luca Cardelli'
    url: 'http://lucacardelli.name/Papers/BasicTypechecking.pdf'
    note: 'A famously readable, implementation-oriented walkthrough of a Hindley-Milner checker - unification, the occurs check, generalization - the practical companion to the theory papers.'
  - title: 'Write You a Haskell'
    author: 'Stephen Diehl'
    url: 'http://dev.stephendiehl.com/fun/006_hindley_milner.html'
    note: 'A hands-on chapter that builds Algorithm W with substitutions and a fresh-variable supply, the same functional design used here, with runnable code to compare against.'
  - title: 'Hindley-Milner type system'
    note: 'The named type discipline this project implements - principal types, let-generalization, and unification-based inference. A good anchor for the vocabulary the lessons use.'
---
