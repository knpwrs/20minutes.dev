---
title: 'Build a Pathfinder'
order: 40
lessons: 32
size: 'Small'
tech: ['A* search', 'Dijkstra', 'Maze generation']
estMin: 20
desc: 'Build a pathfinding and maze library from first principles over a deterministic grid, where every path, cost, node count, and generated maze is exactly reproducible. Start with a grid of walkable and wall cells and a fixed neighbor order, add breadth-first search with path reconstruction, a hand-built binary min-heap and Dijkstra over weighted terrain, then A* with admissible heuristics that finds the same optimal path while expanding fewer nodes. Finish by generating perfect mazes from a seeded random number generator with two classic algorithms and solving one with A*, overlaying the exact optimal path on the maze.'
blurb: 'Model the map as one grid so every neighbor, path, and cost is an exact value you can assert against, with no randomness you cannot reproduce. Each lesson is one concrete spec: the fixed North, East, South, West neighbor order, a FIFO frontier and a came-from map, a binary min-heap with deterministic tie-breaking, edge relaxation over terrain weights, the f = g + h loop and the exact node-expansion counts that prove A* does less work, a self-defined seeded generator, and two maze algorithms that each produce a perfect maze reproduced exactly from a seed.'
overview: |
  Over 32 lessons you build a working pathfinding and maze library from scratch, designed so that every result is exactly reproducible. A grid of walkable and wall cells with a fixed North, East, South, West neighbor order, a binary min-heap with explicit tie-breaking, and a self-defined seeded random number generator together make every path, cost, node-expansion count, and generated maze a specific value you can pin down and assert against. That determinism is the whole point: the library you write behaves identically in any language.

  You start with the grid and its graph view (cells are nodes, adjacent cells are edges, terrain sets edge cost), then build the search algorithms in order of power: breadth-first search for the unweighted shortest path with a FIFO frontier and path reconstruction, Dijkstra over weighted terrain using a min-heap you build by hand, and A* with admissible heuristics (Manhattan for four-way movement, octile for eight-way) that finds the same optimal path as Dijkstra while expanding strictly fewer nodes. Then you generate perfect mazes, ones with exactly one path between any two cells, using a recursive backtracker and randomized Prim's, both seeded so a given seed yields a specific maze. The capstone generates a maze from a fixed seed, solves it with A*, asserts the exact optimal path and its length, and renders the maze with the path overlaid.

  This is a teaching-grade library built around the classic grid-pathfinding design from Amit Patel's Red Blob Games and the original A* paper: it searches a single in-memory grid, is deterministic by construction, and represents paths as lists of coordinates. It is honest about what it stops short of. It does not implement hierarchical or any-angle pathfinding, jump point search, contraction hierarchies, or dynamic replanning (D* / LPA*), and it uses a simple integer cost model rather than floating-point Euclidean distances. Those are exactly the extensions a production navigation system layers on top of this honest core.
parts:
  - name: 'The grid and the graph'
    count: 6
  - name: 'Breadth-first search'
    count: 4
  - name: 'Dijkstra and the min-heap'
    count: 6
  - name: 'A* search'
    count: 4
  - name: 'Maze generation'
    count: 7
  - name: 'Refinements, solving, and the capstone'
    count: 5
caveats:
  note: 'A genuinely working, fully deterministic library: BFS, Dijkstra, and A* (four-way and eight-way) shortest-path search over a grid of walkable, wall, and weighted-terrain cells with a hand-built min-heap and explicit tie-breaking, plus two perfect-maze generators (recursive backtracker and randomized Prim''s) driven by a self-defined seeded RNG, an ASCII renderer with path overlay, and a runnable seed-driven CLI - but it searches a single in-memory grid with an integer cost model, generates only unweighted perfect (single-solution) mazes, and stops short of the advanced techniques a production navigator layers on top.'
  future:
    - 'Give the eight-way A* an expanded-node count so it matches the (path, cost, expanded) shape of the four-way searches, then benchmark BFS vs Dijkstra vs A* expansions across maze sizes'
    - 'Make ParseGrid validate its own input (ragged rows, unknown characters) and return an error rather than silently misparsing'
    - 'Add a weighted or diagonal-aware maze generator so eight-way A* and weighted Dijkstra have generated (not just hand-built) grids to solve'
    - 'Add a braided-maze option (extra passages beyond the spanning tree) so multiple solution paths exist and BFS, Dijkstra, and A* can meaningfully differ'
    - 'Add jump point search for uniform-cost grids, and any-angle search (Theta*) so paths are not restricted to grid edges'
    - 'Add dynamic replanning (D* Lite or LPA*) so a path can be repaired cheaply when walls change, instead of re-searching from scratch'
resources:
  - title: 'Introduction to A*'
    author: 'Amit Patel (Red Blob Games)'
    url: 'https://www.redblobgames.com/pathfinding/a-star/introduction.html'
    note: 'The clearest visual explanation of breadth-first search, Dijkstra, greedy best-first, and A* on a grid, with interactive diagrams of frontier, came-from, cost-so-far, and heuristics. This project follows its progression from BFS to A* almost beat for beat.'
  - title: 'Implementation of A*'
    author: 'Amit Patel (Red Blob Games)'
    url: 'https://www.redblobgames.com/pathfinding/a-star/implementation.html'
    note: 'The companion implementation notes: priority-queue tie-breaking, the difference between early exit and full search, heuristic scaling, and admissibility. The reference for the min-heap and tie-break lessons here.'
  - title: 'A Formal Basis for the Heuristic Determination of Minimum Cost Paths'
    author: 'Peter E. Hart, Nils J. Nilsson, Bertram Raphael (1968)'
    url: 'https://ieeexplore.ieee.org/document/4082128'
    note: 'The original A* paper. It defines the evaluation function f = g + h and proves that an admissible heuristic (one that never overestimates) guarantees an optimal path. Read it for why the algorithm you build is correct.'
  - title: 'Mazes for Programmers'
    author: 'Jamis Buck'
    url: 'https://pragprog.com/titles/jbmaze/mazes-for-programmers/'
    note: 'A whole book of maze-generation algorithms, including the recursive backtracker and Prim''s built here, each producing a perfect maze. The grid-of-cells-with-passages model and the rendering approach in the maze chapter follow this book.'
  - title: 'Maze Generation: Algorithm Recap'
    author: 'Jamis Buck (The Buckblog)'
    url: 'https://weblog.jamisbuck.org/2011/2/7/maze-generation-algorithm-recap'
    note: 'A concise catalogue of maze-generation algorithms with animations, comparing the texture and bias of recursive backtracker, Prim''s, Kruskal''s, and others. Useful when you want a third or fourth generator after the two in this project.'
---
