---
project: build-a-rate-limiter
lesson: 2
title: The Allow contract
overview: Before any real algorithm, we fix the shape every limiter shares - you ask it whether a request is allowed at a given moment, and it answers with a decision. Today you build that contract and the simplest limiter that satisfies it, one that always says yes.
goal: Define the allow decision and an unlimited limiter that always allows.
spec:
  scenario: An unlimited limiter always allows
  status: failing
  lines:
    - kw: Given
      text: 'an Unlimited limiter'
    - kw: When
      text: 'Allow(now) is called at now = 0, then again at now = 1000'
    - kw: Then
      text: 'both return a decision with Allowed = true'
    - kw: And
      text: 'calling it a hundred more times at any now still returns Allowed = true every time'
code:
  lang: go
  source: |
    // every limiter answers Allow(now) with this decision
    type Decision struct {
      Allowed bool
    }
    type Unlimited struct{}
    func (Unlimited) Allow(now int64) Decision {
      return Decision{Allowed: true}
    }
checkpoint: You have the Allow contract and a trivial limiter that satisfies it. Commit and stop here.
---

Every limiter in this project answers the same question: *given the current tick,
may this request proceed?* We nail that contract down as one method, `Allow(now)`,
returning a **`Decision`**. For now the decision carries a single field, `Allowed`.
Later it will also carry a retry-after hint, but starting minimal keeps each
algorithm focused on the one thing that differs between them: how they decide.

The **`Unlimited`** limiter is the trivial baseline - it always allows, ignoring
`now` entirely. That sounds pointless, but it pins the interface: a limiter takes a
tick and returns a decision, nothing more. Passing the current time *in* (rather
than reading a clock inside) is what keeps the limiters pure and exactly testable -
the caller owns the clock we built yesterday and hands each limiter the tick to
judge against.
