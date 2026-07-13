---
project: build-a-spreadsheet-engine
lesson: 30
title: Incremental recalculation
overview: This is the heart of a responsive spreadsheet - when one cell changes, recompute only its dependents, in the right order, and leave everything else alone. Today you build incremental recalculation and prove it touches exactly the right cells.
goal: Recompute only a changed cell's transitive dependents, in topological order, leaving unrelated cells untouched.
spec:
  scenario: Editing a cell recomputes only what depends on it
  status: failing
  lines:
    - kw: Given
      text: 'a recalculated sheet with A1 = 1, B1 = ''=A1+1'', C1 = ''=B1+1'', D1 = 100, and E1 = ''=D1+1'''
    - kw: When
      text: 'A1 is changed to 10 and the sheet recomputes incrementally'
    - kw: Then
      text: 'the recomputed cells are exactly B1 and C1, with Get("B1") now 11 and Get("C1") now 12'
    - kw: And
      text: 'D1 stays 100 and E1 stays 101 - neither is recomputed, since neither depends on A1'
code:
  lang: go
  source: |
    func (s *Sheet) recalcFrom(changed Ref) []Ref {
      affected := setOf(s.dependentsOf(changed))
      var recomputed []Ref
      for _, ref := range s.topoOrder() {   // full order...
        if affected[ref] {                  // ...filtered to the affected set
          c := s.cells[ref]
          c.val = s.eval(c.ast); s.cells[ref] = c
          recomputed = append(recomputed, ref)
        }
      }
      return recomputed
    }
checkpoint: Editing a cell recomputes exactly its dependents, in order. Commit and stop here.
---

Incremental recalculation combines the last two chapters. When a cell changes, its
**transitive dependents** are the only cells that need recomputing (lesson 29), and
they must still be evaluated in **topological order** so a dependent never reads a
stale precedent (lesson 26). So `recalcFrom` computes the affected set, then walks
the full topological order but evaluates only the cells in that set. Edit `A1` and
exactly `B1` then `C1` recompute, to `11` and `12`.

The important half of the assertion is what does **not** happen: `D1` and `E1` are
never touched. `E1` is a formula, but it depends on `D1`, not on `A1`, so it is not
in the affected set and keeps its value without re-evaluating. That is the whole
point of incremental recalc - in a real sheet with thousands of formulas, editing
one input should recompute a handful of cells, not all of them. Returning the list
of recomputed cells makes the behavior observable, and the capstone will assert on
it directly. What is still missing is what happens when the graph has no valid order
at all - a cycle - which is next.
