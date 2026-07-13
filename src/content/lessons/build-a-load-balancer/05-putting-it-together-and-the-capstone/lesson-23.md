---
project: build-a-load-balancer
lesson: 23
title: Graceful draining
overview: To retire a backend without dropping requests, you drain it - stop sending new work while letting in-flight requests finish. Today you add the Draining state and confirm it leaves selection but keeps its active count until the work completes.
goal: Add a draining state that removes a backend from selection while its in-flight connections finish naturally.
spec:
  scenario: A draining backend takes no new work but finishes its in-flight requests
  status: failing
  lines:
    - kw: Given
      text: 'a round-robin balancer over A, B, C all up, with A holding 2 active connections'
    - kw: When
      text: 'A is marked draining and four selections are made'
    - kw: Then
      text: 'the selections are B, C, B, C - A never appears, and Available() is [B, C]'
    - kw: And
      text: 'A.Active() stays at 2 while draining, and only drops to 0 as those two leases are released - A remains out of selection the whole time'
code:
  lang: go
  source: |
    // add Draining to the status enum: const ( Up Status = iota; Down; Draining )
    func (b *Backend) MarkDraining() { b.status = Draining }
    func (b *Backend) IsDraining() bool { return b.status == Draining }
    // IsUp() is still status == Up, so Available() already excludes a draining
    // backend - no change needed there. Its active count keeps ticking down
    // as in-flight leases release.
checkpoint: A draining backend is excluded from new work but finishes what it already has. Commit and stop here.
---

**Draining** (also called connection draining or graceful shutdown) is how you take a
backend out of service without hurting the requests it is currently handling. Unlike
an abrupt `Down`, a draining backend keeps its in-flight connections alive to
completion; it simply stops being eligible for **new** ones. This is what lets you
deploy, scale down, or restart a server cleanly.

The design pays off here: because `Available()` returns only `Up` backends and you
modelled status as an enum, adding a third `Draining` state removes the backend from
selection with **no change to any algorithm** - it just stops appearing in
`Available()`. Meanwhile its active count is untouched, so the in-flight leases
continue to tick down as each request finishes and calls its release. The pin to
watch is exactly that split: `A` vanishes from selection the instant it starts
draining, yet its `Active()` count stays at 2 and only reaches 0 through normal lease
releases, never by being forcibly reset.
