---
project: build-a-load-balancer
lesson: 8
title: Weighted round-robin
overview: Backends are not equal - a bigger box should get more traffic. Weighted round-robin gives each backend a share proportional to its weight. Today you build it by expanding weights into a repeating schedule.
goal: Distribute selection in proportion to weight, cycling A,A,A,B for weights 3 and 1.
spec:
  scenario: Weighted round-robin cycles in proportion to weight
  status: failing
  lines:
    - kw: Given
      text: 'a weighted round-robin selector over backend A with weight 3 and backend B with weight 1, both up'
    - kw: When
      text: 'Select is called five times'
    - kw: Then
      text: 'it returns A, A, A, B, A - one full cycle of A,A,A,B and then the start of the next'
    - kw: And
      text: 'across each full cycle of length 4, A appears exactly 3 times and B exactly once'
code:
  lang: go
  source: |
    // build a schedule by repeating each backend weight times, in pool order:
    // A(3), B(1) -> [A, A, A, B]; then round-robin over that schedule
    type WeightedRR struct { pool *Pool; sched []*Backend; n int }
    func (w *WeightedRR) build() {
      w.sched = nil
      for _, b := range w.pool.Available() {
        for i := 0; i < b.Weight(); i++ { w.sched = append(w.sched, b) }
      }
    }
    // Select: build once (or when the pool changes), then sched[n % len]; n++
checkpoint: Weighted round-robin gives each backend a share of traffic equal to its weight. Commit and stop here.
---

**Weighted round-robin** lets an operator send more traffic to a more capable
backend. The simplest correct way to do it is **schedule expansion**: repeat each
backend in a list as many times as its weight, then run ordinary round-robin over
that expanded list. Weights 3 and 1 expand to `[A, A, A, B]`, so four consecutive
picks give three `A`s and one `B`, and the fifth pick wraps to `A` again.

The order within the cycle here is the blunt grouped one - all of `A`, then `B` -
which is easy to reason about and exact to test. Production balancers often use a
**smooth** weighted round-robin instead, which interleaves the picks (`A, A, B, A`)
so the same 3-to-1 ratio arrives more evenly spread over time; that is a natural
extension noted in the caveats. Build the schedule from `Available()` so a down
backend contributes no slots, and rebuild it when weights or membership change.
