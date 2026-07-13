---
project: build-a-pathfinder
lesson: 5
title: Parsing an ASCII grid
overview: Typing out SetWall calls to build a test map is tedious. Today you parse a grid straight from an ASCII drawing, where a dot is open and a hash is a wall, so every later test can describe its map as a picture.
goal: Parse a multi-line ASCII string into a grid, reading '.' as open and '#' as a wall.
spec:
  scenario: An ASCII drawing becomes a grid with the right size and walls
  status: failing
  lines:
    - kw: Given
      text: "the three-line string '...' , '.#.' , '...' joined by newlines"
    - kw: When
      text: 'it is parsed with ParseGrid'
    - kw: Then
      text: 'the grid has Width 3 and Height 3'
    - kw: And
      text: 'Wall(1, 1) is true and every other cell reports Wall false'
code:
  lang: go
  source: |
    // split on newlines; height is line count, width is line length
    func ParseGrid(s string) *Grid {
      lines := strings.Split(strings.TrimRight(s, "\n"), "\n")
      g := NewGrid(len(lines[0]), len(lines))
      for y, line := range lines {
        for x := 0; x < len(line); x++ {
          if line[x] == '#' { g.SetWall(Coord{x, y}) }
        }
      }
      return g
    }
checkpoint: You can build a grid from an ASCII map. Commit and stop here.
---

Building a test map cell by cell does not scale past a few walls. Every pathfinding
example in books and articles is drawn as a **picture**, so we teach the grid to
read that picture directly. The convention is the standard one: a **dot** (`.`) is
an open cell and a **hash** (`#`) is a wall. Rows are separated by newlines.

The parse is mechanical: the number of lines is the height, the length of a line is
the width, and any `#` marks a wall at that column and row. Trimming a trailing
newline first keeps a final blank line from inventing an empty row. From now on a
test can hand you a whole maze as a few lines of text, which is exactly how the spec
for every search in this project will describe its map.
