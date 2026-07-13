---
project: build-a-sudoku-solver
lesson: 5
title: A cell's peers
overview: The value in a cell is constrained only by the other cells it shares a unit with - its peers. Today you compute, for each cell, the exactly 20 peers it must differ from, the lookup that makes candidates and propagation fast.
goal: Compute the set of peers - the cells sharing a row, column, or box - for each cell.
spec:
  scenario: Every cell has exactly 20 peers
  status: failing
  lines:
    - kw: Given
      text: 'the 27 units'
    - kw: When
      text: 'the peers of cell 0 are collected as the union of its units minus itself'
    - kw: Then
      text: 'cell 0 has exactly 20 peers, cell 20 is among them (same box) and cell 80 is not'
    - kw: And
      text: 'every cell has exactly 20 peers - for example cell 40 also has 20'
code:
  lang: go
  source: |
    // peers of a cell = union of the units it belongs to, excluding itself
    func Peers(cell int) []int {
      seen := map[int]bool{}
      for _, u := range Units() {
        if contains(u, cell) {
          for _, c := range u { if c != cell { seen[c] = true } }
        }
      }
      // return the sorted keys of seen (there will be 20)
    }
checkpoint: Each cell knows its 20 peers. Commit and stop here.
---

A cell does not have to differ from all 80 others, only from the ones it shares a
constraint with. Those are its **peers**: the union of its row, its column, and its
box, with the cell itself removed. Counting them is a nice check on your units - a
row contributes 8 others, the column another 8, and the box adds 4 more that were
not already in that row or column, for a total of exactly **20 peers** for every
cell on the board.

Peers are the workhorse lookup of the solver. "What digits can this blank hold?" is
"which digits are not already used by its 20 peers?", and Norvig's propagation is
"when a cell is fixed, remove that digit from its 20 peers." Precomputing this list
per cell now means those questions never have to rescan the units again.
