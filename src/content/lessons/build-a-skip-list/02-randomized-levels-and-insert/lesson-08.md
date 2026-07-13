---
project: build-a-skip-list
lesson: 8
title: Random tower heights from coin flips
overview: A skip list assigns each node a tower height by flipping a coin - keep climbing while it comes up heads. Today you turn your generator's stream into those heights, with one important twist about which bit of the number to trust.
goal: Turn the generator into a height by counting consecutive heads, using a high bit of each value as the coin.
spec:
  scenario: randomLevel counts consecutive heads to pick a height
  status: failing
  lines:
    - kw: Given
      text: 'a generator seeded with 1, where a coin is heads when the top bit of next is set (next is at least 2147483648)'
    - kw: When
      text: 'randomLevel is called six times (start at height 1, add one for each consecutive heads)'
    - kw: Then
      text: 'it yields heights 1, 1, 3, 1, 3, 2'
    - kw: And
      text: 'each height equals 1 plus the number of heads before the first tails (so height 3 means heads, heads, tails)'
code:
  lang: go
  source: |
    // Height starts at 1; each heads bumps it. Use a HIGH bit for the coin:
    // an LCG's low bits cycle with a tiny period, so next()&1 is nearly useless.
    func (r *rng) coin() bool { return r.next()>>31 == 1 }
    func (r *rng) randomLevel() int {
      lvl := 1
      for r.coin() { lvl++ }
      return lvl
    }
checkpoint: You can turn the seeded stream into reproducible tower heights. Commit and stop here.
---

The height of a node's tower is chosen by a **coin flip**: start at height 1 (every
node reaches level 0), and while the coin comes up heads, add another level. With a
fair coin, about half the nodes stay height 1, a quarter reach height 2, an eighth
reach 3, and so on - exactly the thinning-out that makes the upper levels sparse
express lanes. That geometric distribution is what balances a skip list without any
rotations.

The twist is **which bit** to use as the coin. It is tempting to test the lowest bit
of each value, but the low-order bits of a linear congruential generator cycle with
a tiny period (the very lowest bit just alternates), so `next() & 1` would produce a
rigid, useless pattern. The **high** bits are far better mixed, so we call it heads
when the top bit is set - equivalently, when the value is at least 2147483648. With
seed 1 that gives heights 1, 1, 3, 1, 3, 2: the third call flips heads, heads, tails
to reach 3. Nothing bounds the height yet, which the next lesson fixes.
