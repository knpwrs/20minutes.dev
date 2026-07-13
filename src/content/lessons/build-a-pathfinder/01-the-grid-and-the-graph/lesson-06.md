---
project: build-a-pathfinder
lesson: 6
title: Printing the grid
overview: To see what the pathfinder is doing you need to look at the map. Today you render a grid back to ASCII, the mirror of parsing, giving the chapter its first demoable deliverable, a grid that round-trips text to grid and back.
goal: Render a grid to a multi-line ASCII string that round-trips with the parser.
spec:
  scenario: Printing a parsed grid reproduces the original drawing
  status: failing
  lines:
    - kw: Given
      text: "a grid parsed from the three rows '...' , '.#.' , '...' joined by newlines"
    - kw: When
      text: 'the grid is rendered with String'
    - kw: Then
      text: "the result equals the original string exactly, '...' then '.#.' then '...' joined by newlines"
    - kw: And
      text: 'walls render as # and open cells as ., with no trailing newline after the last row'
code:
  lang: go
  source: |
    func (g *Grid) String() string {
      var b strings.Builder
      for y := 0; y < g.H; y++ {
        for x := 0; x < g.W; x++ {
          if g.Wall(Coord{x, y}) { b.WriteByte('#') } else { b.WriteByte('.') }
        }
        if y < g.H-1 { b.WriteByte('\n') }
      }
      return b.String()
    }
checkpoint: A grid prints back to the same ASCII you parsed, closing the round trip. Commit and stop here.
---

Being able to **see** the map is what makes everything after this debuggable. If a
search returns a strange path, you print the grid, and later you print the path
overlaid on it. Rendering is the exact mirror of parsing: walk the cells row by row,
emit `#` for a wall and `.` for an open cell, and join rows with newlines.

The one detail that matters is the **round trip**. Parsing an ASCII map and printing
it again should give back the identical string, which means no stray trailing
newline after the last row. That property is a tiny but real correctness check on
both directions at once, and it closes out the chapter: you now have a grid you can
build from text, mark with walls, ask for neighbors, and print back out, which is
the entire world the searches in the next chapters will explore.
