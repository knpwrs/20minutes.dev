---
project: build-a-skip-list
lesson: 9
title: Capping the height and giving it to the list
overview: An unbounded height could build a tower taller than the head sentinel and run off the end of its pointers. Today you cap the height at the maximum level, and move the generator inside the list so the list owns its own reproducible source of randomness.
goal: Bound randomLevel at MaxLevel and wire a seeded generator into the skip list itself.
spec:
  scenario: The list generates capped, reproducible tower heights
  status: failing
  lines:
    - kw: Given
      text: 'a skip list created with NewSkipList(698), whose generator is seeded from that seed'
    - kw: When
      text: 'the list generates a random level'
    - kw: Then
      text: 'it returns 4, the maximum - the coin came up heads three times and the cap stopped the climb (uncapped it would have reached 7)'
    - kw: And
      text: 'a list created with NewSkipList(1) generates the sequence 1, 1, 3, 1, 3, 2 (the same stream, now capped at 4)'
code:
  lang: go
  source: |
    // Stop climbing at MaxLevel so a tower never exceeds the head's height.
    func (r *rng) level(max int) int {
      lvl := 1
      for lvl < max && r.coin() { lvl++ }
      return lvl
    }
    // NewSkipList now builds the generator from the seed:
    //   s.rng = newRNG(seed)
    // and s.randomLevel() calls s.rng.level(MaxLevel).
checkpoint: The list owns a seeded generator that produces capped tower heights. Commit and stop here.
---

A tower must never be taller than the head sentinel, because the head only has
`MaxLevel` forward pointers to link into. An unbounded coin-flip height could, on a
long lucky streak, ask for a level the head does not have. So the generator gets a
**cap**: stop climbing once the height reaches `MaxLevel`, even if the coin would
keep saying heads. With seed 698 the coin comes up heads three times in a row, which
uncapped would reach 7, but the cap holds it at 4 - it stops the loop before flipping
a fourth time.

The second move is organizational: the generator belongs **inside** the list. Up to
now `rng` was a free-standing helper; now `NewSkipList` builds one from the seed it
was handed back in lesson 2 and stores it, and the list exposes a small
`randomLevel` that calls it with the cap. From here on, the list is a self-contained,
seeded machine: hand it a seed and every tower height it will ever choose is fixed.
The next lesson finally connects this to insertion.
