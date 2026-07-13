---
title: 'Build a Rate Limiter'
order: 44
lessons: 23
size: 'Small'
tech: ['Rate limiting', 'Token bucket', 'Sliding window']
estMin: 20
desc: 'Build a rate-limiting library from first principles, driven by an injected virtual clock so every allow and deny decision is exact and reproducible. Start with the Allow contract and a fixed quota, then implement the classic algorithms in turn: a fixed-window counter and its boundary-burst flaw, a precise sliding-window log, the sliding-window-counter approximation, and a token bucket with fractional refill and a leaky-bucket variant. Add per-key isolation and a retry-after hint, and finish by running one scripted request stream through three limiters at once to see exactly where they agree and where they diverge at a window boundary.'
blurb: 'No wall clock and no sleeps: time is a virtual clock you advance by hand, so each limiter is one concrete spec with exact allow/deny sequences and internal state. Pin the fixed window allowing exactly the limit then denying until the boundary reset, the up-to-2x-limit burst across two adjacent windows, the sliding-window log denying a request the fixed window would wrongly allow, the weighted sliding-counter estimate at a partial offset, a token bucket refilling fractionally and capping at capacity, a drained bucket re-allowing the exact tick one token has accrued, a computed retry-after, and per-key isolation so one client cannot starve another.'
overview: |
  Over 23 lessons you build a small rate-limiting library: several limiter algorithms that each answer one question - should this request be allowed right now? The whole thing is driven by an injected virtual clock you control with Now() and Advance(d), so there is no real time and no sleeping. Every allow/deny decision and every token or counter value is a number you assert exactly, and the same limiter behaves identically in any language.

  You begin with the Allow contract and a plain quota, then build the classic algorithms one at a time: a fixed-window counter (and the boundary-burst flaw where two adjacent windows admit up to twice the limit in a short span), a sliding-window log that keeps request timestamps and is exact but O(requests) in memory, the sliding-window-counter approximation that weights the previous window by how much it still overlaps, and a token bucket that refills fractionally with elapsed time and caps bursts at its capacity, plus a leaky-bucket variant that smooths instead of bursting. You then add a keyed limiter so one client cannot starve another, a computed retry-after hint, and idle-key cleanup. The capstone runs one scripted, timestamped request stream through the fixed-window, sliding-window-counter, and token-bucket limiters at once and asserts each one's exact allow/deny timeline and final state.

  This is a teaching-grade, single-process, in-memory library: it limits by virtual-clock ticks against an injected clock, it is not thread-safe, and it does no distributed or cross-process coordination (no shared store, no clock synchronization). That is the honest core that production limiters - the ones behind Cloudflare, Stripe, and Envoy - extend with a shared datastore, atomic operations, and real time.
parts:
  - name: 'The limiter contract and a virtual clock'
    count: 3
  - name: 'The fixed-window counter'
    count: 3
  - name: 'The sliding-window log'
    count: 3
  - name: 'The sliding-window counter'
    count: 3
  - name: 'Token bucket and the leaky bucket'
    count: 5
  - name: 'Per-key limiting, retry-after, and the capstone'
    count: 6
caveats:
  note: 'A genuinely working single-process rate-limiting library driven by an injected virtual clock - fixed-window, sliding-window-log, sliding-window-counter, token-bucket, and leaky-bucket limiters with exact reproducible decisions, plus per-key isolation, retry-after hints, idle-key purging, and graceful denial on zero or negative configs - but it is not thread-safe, reads time from an int64 tick counter rather than a real clock, and does no distributed or cross-process coordination.'
  future:
    - 'Add mutexes so each limiter and the keyed map are safe to share across goroutines or threads'
    - 'Wrap a real wall-clock time source behind the Clock so the same limiters run against production traffic, not just virtual ticks'
    - 'Support distributed limiting over a shared store (for example Redis) so a limit holds across many servers, with atomic updates and clock-skew handling'
    - 'Return an error from the constructors on invalid config instead of silently denying every request'
    - 'Give the sliding-window counter a retry-after by inverting its continuous decay estimate'
    - 'Add layered limits (for example a per-second and a per-minute rule combined) and more limiter families'
resources:
  - title: 'How we built rate limiting capable of scaling to millions of domains'
    author: 'Cloudflare'
    url: 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/'
    note: 'Cloudflare''s writeup of the sliding-window-counter algorithm this project builds - approximating a rolling window by weighting the previous fixed window by its overlap. The clearest real-world motivation for why the approximation is close enough and far cheaper than a log.'
  - title: 'Scaling your API with rate limiters'
    author: 'Paul Tarjan (Stripe)'
    url: 'https://stripe.com/blog/rate-limiters'
    note: 'Stripe''s engineering account of running token-bucket limiters in production - request-rate versus concurrency limiting, load shedding, and why bucketed rates behave well under bursty traffic.'
  - title: 'Token bucket'
    url: 'https://en.wikipedia.org/wiki/Token_bucket'
    note: 'The reference definition of the token-bucket meter: a bucket of capacity C refilling at rate r, each conforming packet removing a token. The exact model the token-bucket chapter implements with fractional accrual.'
  - title: 'Leaky bucket'
    url: 'https://en.wikipedia.org/wiki/Leaky_bucket'
    note: 'The companion traffic-shaping algorithm: a queue that drains at a constant rate, smoothing bursts rather than admitting them. Read alongside the token bucket to see the two classic shapers side by side.'
  - title: 'System Design Interview - An Insider''s Guide: Design a Rate Limiter'
    author: 'Alex Xu'
    url: 'https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter'
    note: 'A systems-design survey of the whole family - fixed window, sliding log, sliding counter, token and leaky bucket - with the tradeoffs, where each is deployed, and how distributed rate limiting adds a shared store and race conditions on top of the single-node core built here.'
  - title: 'RFC 6585: Additional HTTP Status Codes (429 Too Many Requests)'
    author: 'Nottingham, Fielding'
    url: 'https://www.rfc-editor.org/rfc/rfc6585'
    note: 'The standard that defines 429 Too Many Requests and the Retry-After response header - the wire contract a real limiter''s allow/deny plus retry-after hint feeds into.'
---
