---
title: 'Build a Programming Language'
order: 3
lessons: 48
size: 'Medium'
tech: ['Pratt parsing', 'Tree-walking evaluation', 'Closures']
estMin: 20
desc: 'Take source text all the way to a working interpreter: tokenize, parse into a syntax tree, then evaluate it into real results.'
blurb: 'Design a small language and make it run. Start with a REPL that echoes what you type and end with one that executes programs with variables, functions, closures, arrays, and maps. Every token, node, and evaluation rule comes with a concrete spec, so the interpreter stays correct as it grows.'
overview: |
  Over 48 lessons you build a working interpreter for a small dynamically-typed language, from scratch. You start with a REPL that echoes your input, then grow it one layer at a time: a lexer that turns source text into tokens, a Pratt parser that turns tokens into a syntax tree, and a tree-walking evaluator that runs that tree into real values.

  By the end your REPL - and a runner that executes a source file - handles integers, booleans, strings and null; arithmetic and comparison with correct precedence; `let` bindings and assignment; `if`/`else` and `while`; first-class functions with closures and recursion; arrays and hash maps with an index operator; and a set of built-in functions. You will write higher-order functions like `map` in the language itself.

  This is a teaching-grade interpreter: it walks the syntax tree directly and correctly, but stops short of what a production language runtime adds - a bytecode compiler and virtual machine, a static type system, garbage-collection tuning, floating-point numbers, and a module system. What you finish with is the honest core those systems are built on.
parts:
  - name: 'Tokenizing'
    count: 8
  - name: 'Parsing'
    count: 12
  - name: 'Evaluation'
    count: 14
  - name: 'Functions & closures'
    count: 7
  - name: 'Data structures & builtins'
    count: 7
caveats:
  note: 'This is a working tree-walking interpreter with a REPL, a source-file runner, and a zero-setup demo, correctly executing the whole language the lessons build - but it stops at a teaching-grade core and skips conveniences (comments, else-if, digits in identifiers, line numbers in error messages) the lessons never reach.'
  future:
    - 'Track source line and column on every token so parser and runtime errors say where the problem is, not just what it is'
    - 'Support else if chaining directly instead of requiring nested else { if (...) { } }'
    - 'Allow identifiers to contain digits after the first character (x1, arr2) and add // line comments to the lexer'
    - 'Give hashes a stable, sorted key order when printed instead of Go-style random map iteration'
    - 'Add floating-point numbers so division stops truncating, and a null literal so absence is expressible directly'
    - 'Compile the syntax tree to bytecode and run it on a virtual machine (the natural sequel to a tree-walker) for real speed'
resources:
  - title: 'Crafting Interpreters'
    author: 'Robert Nystrom'
    url: 'https://craftinginterpreters.com/'
    note: 'The clearest book on building a language - a tree-walking interpreter then a bytecode VM. The scanning, parsing, and evaluation chapters map directly onto this project.'
  - title: 'Writing an Interpreter in Go'
    author: 'Thorsten Ball'
    url: 'https://interpreterbook.com/'
    note: 'A compact, hands-on build of a lexer, Pratt parser, object system, and tree-walking evaluator for a small language - the closest single match to the arc you build here.'
  - title: 'Writing a Compiler in Go'
    author: 'Thorsten Ball'
    url: 'https://compilerbook.com/'
    note: 'The sequel that takes the same language past a tree-walker into a bytecode compiler and stack-based virtual machine - the natural next step after this project.'
  - title: 'Structure and Interpretation of Computer Programs'
    author: 'Harold Abelson, Gerald Jay Sussman'
    url: 'https://mitpress.mit.edu/sites/default/files/sicp/index.html'
    note: 'The classic on evaluation, environments, and closures - chapter 4 builds a metacircular evaluator that explains why the environment model you use works.'
  - title: 'Compilers: Principles, Techniques, and Tools (the Dragon Book)'
    author: 'Aho, Lam, Sethi, Ullman'
    note: 'The deep reference on lexical analysis, grammars, and parsing theory for when you want the formal treatment behind the hand-written lexer and parser.'
  - title: 'Top Down Operator Precedence'
    author: 'Vaughan Pratt'
    url: 'https://tdop.github.io/'
    note: 'The original 1973 paper describing the Pratt parsing technique used throughout the parsing chapter.'
---
