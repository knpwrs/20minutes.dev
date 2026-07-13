---
project: build-a-pathfinder
lesson: 23
title: The maze grid and carving passages
overview: A maze is a grid of cells with walls between them that you knock down to form passages. Today you build that structure, starting fully walled, with an operation to carve a passage between two adjacent cells.
goal: Represent a maze as cells with walls between them, and carve a passage between neighbors.
spec:
  scenario: Cells start walled off and passages are carved symmetrically
  status: failing
  lines:
    - kw: Given
      text: 'a new 3 by 3 maze where every cell starts walled off from its neighbors'
    - kw: When
      text: 'Linked is queried before and after carving'
    - kw: Then
      text: 'Linked((0,0), (1,0)) is false before carving, and true after Carve((0,0), (1,0))'
    - kw: And
      text: 'the passage is symmetric: Linked((1,0), (0,0)) is also true, while an uncarved pair like Linked((0,0), (0,1)) stays false'
code:
  lang: go
  source: |
    type Maze struct { W, H int; links map[[2]Coord]bool }
    func NewMaze(w, h int) *Maze { return &Maze{W: w, H: h, links: map[[2]Coord]bool{}} }
    // normalize the pair so (a,b) and (b,a) are the same key
    func key(a, b Coord) [2]Coord {
      if a.Y < b.Y || (a.Y == b.Y && a.X < b.X) { return [2]Coord{a, b} }
      return [2]Coord{b, a}
    }
    func (m *Maze) Carve(a, b Coord)       { m.links[key(a, b)] = true }
    func (m *Maze) Linked(a, b Coord) bool { return m.links[key(a, b)] }
checkpoint: A maze of fully walled cells can have passages carved between neighbors. Commit and stop here.
---

A maze is best thought of not as walls but as **connections between cells**. Picture a
grid of rooms, each initially sealed from all four neighbors; generating a maze means
knocking down some of those interior walls to link rooms into a network of passages.
So the maze tracks, for each adjacent pair of cells, whether a **passage** joins them.

A passage is **undirected**: if you can walk from `A` to `B`, you can walk back, so
`Linked(A, B)` and `Linked(B, A)` must agree. We guarantee that by normalizing every
pair to a single canonical key before storing it, so the two orderings map to the
same entry. Every cell starts with no links (fully walled), and `Carve` adds one.
This cells-and-passages model is deliberately separate from the walkable/wall grid the
searches use; the next lesson renders one into the other so A* can solve a maze.
