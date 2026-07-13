---
title: 'Build a Sudoku Solver'
order: 38
lessons: 28
size: 'Small'
tech: ['Constraint propagation', 'Backtracking search', 'Constraint satisfaction']
estMin: 20
desc: 'Build a real Sudoku solver from first principles, following Peter Norvig''s approach of constraint propagation plus backtracking search, as an importable library. Start with the board - an 81-cell grid, an 81-character puzzle string, the 27 units and each cell''s 20 peers, and a validity check - then compute per-cell candidate sets, write a correct backtracking solver, speed it up with the most-constrained-cell heuristic, add naked-single and hidden-single propagation to a fixpoint with contradiction detection, and finish with solution counting for uniqueness, a seeded puzzle generator, and a difficulty rating. Every step is one concrete spec with exact grids, candidate sets, and counts, and the whole thing is deterministic so every value reproduces in any language.'
blurb: 'Model a Sudoku grid as 81 cells and every rule as the 27 units and 20 peers, so parsing, validity, candidates, and solutions are all exact strings you can assert against. Each lesson is one idea with pinned values: the candidate set of a cell after removing its peers, a naked single cascading through its peers, a hidden single found in a unit, a contradiction (zero candidates) forcing a backtrack, the most-constrained cell chosen, an already-solved grid returned unchanged, an invalid puzzle reported as no solution, a two-solution puzzle reported as non-unique, and the exact solved grid of a known hardest puzzle.'
overview: |
  Over 28 lessons you build a working Sudoku solver as a small importable library, following Peter Norvig''s classic recipe: constraint propagation to shrink the problem, then backtracking search to finish it. Because the whole design is deterministic - a fixed cell and candidate order, and a self-defined seeded generator - every lesson pins exact values (a candidate set, a solved 81-character grid, a solution count) that reproduce in any language you choose.

  You start with the board: an 81-cell grid, parsing and printing an 81-character puzzle string, the 27 units (9 rows, 9 columns, 9 boxes) and each cell''s 20 peers, and a no-duplicates validity check. You compute each empty cell''s candidate set, then write a correct backtracking solver and make it fast with the most-constrained-cell (MRV) heuristic. Next comes Norvig''s propagation core - naked singles, hidden singles, propagation to a fixpoint, and contradiction detection - interleaved with search for the full fast solver. The final chapter counts solutions to test uniqueness, generates a uniquely-solvable puzzle from a seed, and rates difficulty, and the capstone solves a suite of real puzzles (an easy one, a hard one, and a known hardest) to their exact solved grids.

  This is a genuinely complete teaching-grade solver: it solves any valid 9x9 puzzle, reports no-solution and non-unique puzzles honestly, and generates its own. It builds the constraint-propagation-plus-search design directly and stops short of the alternative exact-cover formulation (Knuth''s Dancing Links) and of human-style solving techniques beyond singles (naked and hidden pairs, box-line reduction, X-Wing), which are natural next steps rather than gaps in the solver.
parts:
  - name: 'The board and its units'
    count: 6
  - name: 'Candidates'
    count: 3
  - name: 'Backtracking search'
    count: 5
  - name: 'Constraint propagation'
    count: 6
  - name: 'Uniqueness, generation, and difficulty'
    count: 6
  - name: 'Capstone'
    count: 2
caveats:
  note: 'A genuinely complete teaching-grade engine and CLI that solves, rates, and generates any valid 9x9 Sudoku - parse and validity, per-cell candidates, backtracking search with the MRV heuristic, naked-single and hidden-single propagation to a fixpoint with contradiction detection, the full propagation-plus-search solver, solution counting for uniqueness, and a seeded generator - but difficulty is only a binary Easy/Hard split, and the propagation stops at naked and hidden singles rather than the fuller human-technique repertoire.'
  future:
    - 'Grade difficulty on a finer scale by weighting the techniques and search depth a puzzle requires, instead of the binary Easy/Hard split'
    - 'Add more propagation techniques - naked and hidden pairs and triples, pointing pairs, box-line reduction, X-Wing - so more puzzles solve by pure deduction'
    - 'Build the alternative exact-cover solver with Knuth''s Dancing Links (DLX) and compare it against the constraint-propagation approach'
    - 'Put an iteration cap or watchdog on the search and generator so pathological or malformed inputs fail fast rather than running long'
    - 'Extend the CLI with batch and file/stdin modes to solve or rate many puzzles per run, and emit results as machine-readable output'
resources:
  - title: 'Solving Every Sudoku Puzzle'
    author: 'Peter Norvig'
    url: 'https://norvig.com/sudoku.html'
    note: 'The essay this project is built on - representing a grid as cell-to-candidates, assigning as constraint propagation (eliminate a value from a cell''s peers, cascade naked and hidden singles), and finishing with depth-first search over the most-constrained cell. The clearest short account of the whole approach.'
  - title: 'Dancing Links'
    author: 'Donald E. Knuth'
    url: 'https://arxiv.org/abs/cs/0011047'
    note: 'The alternative formulation: model Sudoku as an exact-cover problem and solve it with Algorithm X over a doubly-linked-list matrix (DLX). A different and elegant lens on the same puzzle, and the natural next project after this one.'
  - title: 'Artificial Intelligence: A Modern Approach'
    author: 'Stuart Russell, Peter Norvig'
    url: 'https://aima.cs.berkeley.edu/'
    note: 'The Constraint Satisfaction Problems chapter is the textbook home of everything here - variables, domains, and constraints; arc consistency and AC-3; the minimum-remaining-values heuristic; and backtracking search. Sudoku is its canonical worked example.'
  - title: 'There is no 16-clue Sudoku puzzle'
    author: 'Gary McGuire, Bastian Tugemann, Gilles Civario'
    url: 'https://arxiv.org/abs/1201.0749'
    note: 'The exhaustive-search proof that every proper (uniquely solvable) Sudoku needs at least 17 clues. Background for the uniqueness and generation chapter, and the source of the famous 17-clue puzzles used as test data.'
  - title: 'Sudoku Creation and Grading'
    author: 'Andrew Stuart'
    url: 'https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf'
    note: 'A practical writeup of generating puzzles by digging holes from a full grid while a unique solution remains, and grading difficulty by which solving techniques a puzzle requires - the direct companion to this project''s generation and difficulty lessons.'
---
