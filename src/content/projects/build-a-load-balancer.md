---
title: 'Build a Load Balancer'
order: 28
lessons: 25
size: 'Small'
tech: ['Load balancing', 'Health checking', 'Weighted round-robin']
estMin: 20
desc: 'Balance requests across backends: round-robin, least-connections, health checks, and failover.'
blurb: 'Model request dispatch as an injected transport so selection, connection tracking, and health checks are all exactly testable with pinned sequences - no sockets, no flakiness. Every lesson is one concrete spec with exact values: round-robin wrapping from the last backend back to the first, weighted 3-to-1 cycling A,A,A,B, least-connections breaking a tie deterministically, power-of-two-choices taking the less loaded of two, ejection after exactly three consecutive failures, recovery after two good probes, an all-down pool returning a clear error instead of hanging, and a draining backend excluded from new work while its in-flight count still drains to zero.'
overview: |
  Over 25 lessons you build a working load balancer from scratch, designed so every decision it makes is exactly testable. The trick is an injectable transport: instead of opening real sockets, the balancer dispatches each request through a function you supply that maps a chosen backend to a response. That keeps selection order, connection counts, and health-state transitions all deterministic - the same balancer core runs in any language, and every lesson pins an exact sequence, count, or state.

  You start with a backend pool you can add to, remove from, and filter to the healthy members. Then you build the selection algorithms one per lesson - round-robin with its wrap-around cursor, weighted round-robin, seeded random, least-connections, power-of-two-choices, and sticky sessions - each with its exact dispatch order pinned. On top of that you track active connections through dispatch (up on the way in, down on completion, even on error), and drive a health-check state machine that ejects a backend after a run of failures, probes backends out of band, and brings one back after enough successes. The capstone routes a scripted request stream across backends that flap and drain, asserting the exact backend chosen for every request and that every connection count returns to zero.

  This is a teaching-grade layer-7 balancer built around the classic algorithms in HAProxy, NGINX, and Envoy: it selects a healthy backend, tracks load, and reacts to health signals. It is honest about what it stops short of - the graded core dispatches through an injected transport rather than real sockets (the finalize pass adds a runnable TCP reverse proxy), it is single-goroutine with no locking, and it uses simple session-table stickiness rather than a consistent-hashing ring (that is its own separate project). That is the honest core that production proxies extend with real I/O, concurrency, and richer routing.
parts:
  - name: 'The backend pool'
    count: 5
  - name: 'Selection algorithms'
    count: 7
  - name: 'Dispatch and connection tracking'
    count: 5
  - name: 'Health checking, the state machine'
    count: 4
  - name: 'Putting it together and the capstone'
    count: 4
caveats:
  note: 'The balancing, health-checking, and routing logic is genuinely complete and runs end to end - the finalize pass wires the injected-transport core to real HTTP sockets in a runnable reverse proxy (cmd/lb) with live active health probes, failover, and a 503 when everything is down - but it is a minimal string-in, string-out proxy with no header, method, or status passthrough, the weighted round-robin schedule is frozen at construction, and a Backend is not synchronized for the concurrent traffic a real listener drives.'
  future:
    - 'Add a mutex (or atomic fields) to Backend so the active-prober goroutine and concurrent request handlers cannot race on status, active count, and the failure/success streaks'
    - 'Re-check that the chosen backend is still up between selection and dispatch, so a stale pick (notably from weighted round-robin''s frozen schedule) never forwards to an already-down backend'
    - 'Extend Request and Response to carry the method, headers, status code, and a streaming body for true reverse-proxy passthrough instead of a single string'
    - 'Rebuild the weighted round-robin schedule when weights or membership change, and add smooth (interleaved) weighted round-robin so a 3-to-1 split arrives as A,A,B,A rather than A,A,A,B'
    - 'Expose sticky sessions through the runnable proxy''s algorithm flag, and add dynamic backend add/remove plus graceful shutdown for the live listener'
    - 'Grow toward a consistent-hashing ring (its own project) so a key''s backend barely moves when the pool changes, rather than the session-table stickiness used here'
resources:
  - title: 'HAProxy Configuration Manual'
    url: 'https://docs.haproxy.org/2.9/configuration.html'
    note: 'The reference for real-world balancing: the balance algorithms (roundrobin, static-rr, leastconn, source, random), backend weights, and the check / rise / fall health-check parameters this project models directly.'
  - title: 'NGINX HTTP Load Balancing'
    url: 'http://nginx.org/en/docs/http/load_balancing.html'
    note: 'The admin-level view of round-robin, weighted, least-connections, and hash-based methods, plus passive health checks (max_fails / fail_timeout) - the same mechanisms built here from first principles.'
  - title: 'Introduction to modern network load balancing and proxying'
    author: 'Matt Klein'
    url: 'https://blog.envoyproxy.io/introduction-to-modern-network-load-balancing-and-proxying-a57f6ff80236'
    note: 'The Envoy author''s overview of L4 vs L7 balancing, the load-balancing algorithm zoo, and active vs passive health checking - the best single orientation to the problem space.'
  - title: 'Envoy: Load balancing and health checking'
    url: 'https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancing'
    note: 'Production semantics for the algorithms and the health-check state machine (active probing, outlier detection / passive ejection, healthy panic threshold) - read alongside the health-checking chapter.'
  - title: 'The Power of Two Choices in Randomized Load Balancing'
    author: 'Michael Mitzenmacher'
    url: 'https://www.eecs.harvard.edu/~michaelm/postscripts/tpds2001.pdf'
    note: 'The paper behind power-of-two-choices: why sampling two backends and taking the less loaded gives almost the balance of tracking every backend, at a fraction of the cost.'
  - title: 'Nginx and the "power of two choices" load-balancing algorithm'
    author: 'Marc Brooker'
    url: 'https://brooker.co.za/blog/2012/01/17/two-random.html'
    note: 'A short, intuitive writeup of why two random choices beats one, and where it beats even global least-connections under stale load information - the practical companion to the paper.'
---
