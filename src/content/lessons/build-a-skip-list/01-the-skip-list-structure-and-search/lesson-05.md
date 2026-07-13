---
project: build-a-skip-list
lesson: 5
title: Tracing the visited path
overview: To really understand why a skip list is fast, you need to see the path a search takes. Today you record the exact sequence of nodes the search lands on as it drops down the levels, turning the invisible descent into a checkable list of keys.
goal: Return the ordered keys of the real nodes a search visits (excluding the head) as it descends.
spec:
  scenario: The search path records every node the cursor advances onto
  status: failing
  lines:
    - kw: Given
      text: 'the list holding keys 10, 20, 30, 40, 50, 60, 70 (level 2 has only 40; level 1 has 20, 40, 60)'
    - kw: When
      text: 'Path(50) records the nodes the descent moves onto'
    - kw: Then
      text: 'the path is [40] - the search hops to 40 on level 2, then drops to level 0 and stops just before 50'
    - kw: And
      text: 'Path(65) is [40, 60], and Path(5) is the empty path (the search never moves right, since 5 is below the smallest key)'
code:
  lang: go
  source: |
    // Same descent as Search, but append a key each time you step right.
    // The head is never appended - only real nodes the cursor lands on.
    func (s *SkipList) Path(key int) []int {
      visited := []int{}
      x := s.head
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && x.forward[i].key < key {
          x = x.forward[i]
          // visited = append(visited, x.key)
        }
      }
      return visited
    }
checkpoint: You can see the exact drop-down path a search takes. Commit and stop here.
---

The whole promise of a skip list is that search skips work, and the cleanest way to
believe it is to watch where the cursor actually goes. `Path` runs the same descent
as `Search` but appends a key every time it steps right onto a real node. Searching
for 50 in our list, the cursor starts on level 2, hops from the head onto 40 (the
only node up there), finds nothing more to its right on that lane, drops through
level 1 and level 0 without moving (60 and 50 both overshoot), and stops. It touched
exactly one real node, 40, to place a target near the middle of seven keys - that is
the express lane earning its keep.

Searching for 65 hops to 40, then along level 1 to 60, then drops and stops before
65 would be - path `[40, 60]`. Searching for 5, which is smaller than every key, the
cursor never finds a next node below the target on any level, so it moves nowhere
and the path is **empty**. Recording the path changes nothing about how search
works; it just makes the drop-down visible, and it is a satisfying way to confirm
that taller towers really are cutting the work down.
