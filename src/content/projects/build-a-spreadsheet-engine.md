---
title: 'Build a Spreadsheet Engine'
order: 54
lessons: 39
size: 'Medium'
tech: ['Dependency graphs', 'Topological sort', 'Recalculation']
estMin: 20
desc: 'Build the calculation engine behind a spreadsheet from first principles - a library where you set cells and formulas, recalculate, and read the computed values. Start with A1-style addressing and a grid of cells, add a formula tokenizer and a precedence-aware parser that turns "=A1+B1*2" into an AST with cell references and ranges, evaluate arithmetic and a starter function set (SUM, AVERAGE, MIN, MAX, COUNT, IF), then build the real core: a dependency graph, a topological recalculation order via Kahn''s algorithm, incremental recalculation of only a changed cell''s dependents, circular-reference detection, and error values that propagate downstream - ending in an engine that recalculates a real sheet, updates exactly the right cells on an edit, and flags a cycle instead of looping forever.'
blurb: 'Model a spreadsheet as a grid of cells that hold literals or formulas, so every recalculation is exact and testable. Each lesson is one concrete spec with exact addresses and values: A1 maps to column 0 row 0 and AA1 to column 26, "=A1+B1*2" parses to (A1 + (B1 * 2)), SUM(A1:A3) folds a range, the dependency chain A1 to B1 to C1 sorts to a topological order, editing A1 recomputes B1 and C1 but not an unrelated D1, two cells that reference each other are flagged #CIRC! instead of hanging, and a #DIV/0! error propagates to every cell downstream.'
overview: |
  Over 39 lessons you build the calculation engine that sits behind a spreadsheet - not a UI, but the library that makes one work: you set cells and formulas, call recalculate, and read back the computed values, all with exact, testable results. A cell is addressed A1-style and holds either a literal (a number, text, or a boolean) or a formula string that starts with `=`.

  You start with A1 addressing and a grid of cells, then build a formula pipeline: a tokenizer, a precedence-aware parser that turns `=A1+B1*2` into an abstract syntax tree whose leaves are cell references and ranges, and an evaluator for arithmetic plus a starter function set - SUM, AVERAGE, MIN, MAX, COUNT, and IF. On top of that sits the real heart of a spreadsheet: a dependency graph that records which cells each formula reads, a topological recalculation order computed with Kahn's algorithm so every cell is evaluated after its inputs, incremental recalculation that recomputes only a changed cell's transitive dependents, circular-reference detection that flags a cycle instead of looping forever, and error values (`#DIV/0!`, `#REF!`, `#NAME?`, `#CIRC!`) that propagate to every cell downstream. The capstone recalculates a real sheet, edits an input and asserts exactly which cells recompute, and introduces a cycle that gets flagged rather than hanging.

  This is a genuinely working, teaching-grade calculation engine - the same dependency-graph-and-topological-recalc design that VisiCalc, Lotus 1-2-3, and Excel are built on - but it deliberately stops short of a full spreadsheet application: it is a single in-memory sheet with a starter function library, no user interface, no file formats, no cross-sheet or absolute (`$A$1`) references, and no row or column insertion. It is the honest core those products extend with hundreds of functions, persistence, and a grid you can click.
parts:
  - name: 'Cells and A1 addressing'
    count: 7
  - name: 'Parsing formulas'
    count: 8
  - name: 'Evaluating a formula'
    count: 8
  - name: 'The dependency graph'
    count: 5
  - name: 'Incremental recalculation, cycles, and errors'
    count: 8
  - name: 'The capstone'
    count: 3
caveats:
  note: 'A genuinely working, teaching-grade calculation engine over a single in-memory sheet - A1 addressing, a precedence-aware formula parser, the SUM/AVERAGE/MIN/MAX/COUNT/IF function set, dependency-graph recalculation via Kahn''s algorithm, incremental updates that touch only a changed cell''s dependents, circular-reference detection, and error propagation - but it has no string literals inside formulas, no lookup or logical functions beyond IF, and no user interface, file formats, cross-sheet or absolute references, or cell enumeration.'
  future:
    - 'Add string literals to the formula grammar so IF and future functions can branch on or produce text, not just numbers'
    - 'Add the logical functions (NOT, AND, OR) and a lookup function (VLOOKUP, or INDEX plus MATCH) on top of the existing dispatch table'
    - 'Make comparisons and arithmetic type-aware (comparing text and booleans directly) instead of coercing every operand to a number'
    - 'Add a method to enumerate the cells a sheet holds (and their addresses) so callers do not have to track their own address list'
    - 'Support absolute and cross-sheet references (the $A$1 and Sheet2!A1 forms) and row or column insertion that rewrites the affected references'
    - 'Add persistence (load and save a sheet) and more operators (exponent, modulo, string concatenation) to round out the formula language'
resources:
  - title: 'How to make a spreadsheet: from scratch'
    author: 'Alex Kras'
    url: 'https://www.alexkras.com/how-to-make-a-spreadsheet-from-scratch/'
    note: 'A from-scratch build of a small spreadsheet - parsing formulas, resolving cell references, and recalculating - that mirrors the pipeline this project builds.'
  - title: 'Topological sorting (Kahn''s algorithm)'
    url: 'https://en.wikipedia.org/wiki/Topological_sorting'
    note: 'The reference for the recalculation order at the heart of this project: repeatedly remove a node with no remaining incoming edges. A leftover node with a nonzero in-degree is exactly a cell caught in a circular reference.'
  - title: 'Crafting Interpreters'
    author: 'Robert Nystrom'
    url: 'https://craftinginterpreters.com/'
    note: 'The clearest treatment of tokenizing and parsing with operator precedence. Chapters on scanning and Pratt-style parsing map directly onto the formula parser in Chapter 2.'
  - title: 'Directed acyclic graph'
    url: 'https://en.wikipedia.org/wiki/Directed_acyclic_graph'
    note: 'A spreadsheet''s formulas form a DAG - as long as there is no cycle. This is the structure recalculation walks, and the reason a circular reference has to be detected and refused.'
  - title: 'A Brief History of the Electronic Spreadsheet'
    author: 'Dan Bricklin, Bob Frankston'
    url: 'https://www.bricklin.com/history/saga.htm'
    note: 'VisiCalc''s co-inventor on how the first electronic spreadsheet came to be. Useful context for why automatic recalculation - the thing this engine implements - was the whole point.'
  - title: 'Build Your Own Spreadsheet ( raganwald / notes on recalculation)'
    author: 'Reginald Braithwaite'
    url: 'https://raganwald.com/'
    note: 'Essays on the recalculation problem and dependency tracking that a spreadsheet solves - background reading on why naive re-evaluation is wrong and topological order is right.'
---
