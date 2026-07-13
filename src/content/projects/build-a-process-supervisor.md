---
title: 'Build a Process Supervisor'
order: 29
lessons: 30
size: 'Small'
tech: ['Supervision trees', 'Restart policies', 'State machines']
estMin: 20
desc: 'Build a real process supervisor from first principles - the service-management core inside runit, supervisord, and systemd. Model each managed service as a state machine over a fake, injectable process runtime and a virtual clock so every transition, restart decision, and backoff interval is exact and offline-testable. Start with the six-state lifecycle, add start, readiness, stop, and reap over the fake runtime, then restart policies, exponential backoff, crash-loop protection, a dependency graph with topological start order and reverse-order shutdown, and a reconcile loop with graceful shutdown - ending in a supervisor that runs a scripted set of services and asserts the exact state timeline and final states.'
blurb: 'Model each service as a state machine and drive it with an injected runtime and clock, so malloc-style guesswork disappears: every restart decision, backoff interval, and shutdown deadline is a value you assert. Each lesson is one concrete spec with exact states and timings: exit 0 classified clean versus nonzero as failure, on-failure restarting on a crash but never on a clean exit, backoff doubling 1, 2, 4, 8 capped at the max, giving up to Failed after exactly three restarts in the window, a dependent blocked until its dependency is Running, reverse-order shutdown, and SIGTERM then SIGKILL after the grace timeout.'
overview: |
  Over 30 lessons you build the honest core of a process supervisor - the same service-management engine that lives inside runit, daemontools, supervisord, and systemd. The whole graded core is modelled against a fake, injectable process runtime and a virtual clock: each managed service is a state machine, and you drive it with "start this", "it became ready", "it exited with code N", and "the clock advanced". That design keeps every transition, restart decision, and backoff interval exact and fully offline - no real fork or exec, no signals, no wall-clock sleeps - so the supervisor you write behaves identically in any language.

  You start with the service model and its six-state lifecycle (Stopped, Starting, Running, Stopping, Exited, Failed) and a legal-transition guard, then drive services over the fake runtime: start spawns a handle, a readiness signal marks it Running, stop sends SIGTERM, and reaping an exit classifies code 0 as a clean exit versus nonzero as a failure. On that base you add the four restart policies (never, on-failure, always, unless-stopped) and derive each restart decision, exponential backoff between restarts on the virtual clock, crash-loop protection that gives up to Failed after too many restarts in a window, a dependency graph with topological start order, cycle detection, dependents that block until their dependency is ready, reverse-order shutdown, and a reconcile loop with graceful shutdown that escalates SIGTERM to SIGKILL after a grace timeout. The capstone supervises a scripted set of services and asserts the exact state timeline.

  This is a teaching-grade supervisor built around the classic design shared by runit, supervisord, and Erlang/OTP supervision trees: it manages a set of services with policies, backoff, dependencies, and clean shutdown, all against a simulated runtime and clock. It is honest about where it stops: the specs never touch the operating system, so the real fork/exec of child processes, sending real POSIX signals, and reaping real PIDs with wait live only in the runnable entry point the finalize pass adds - that layer is inherently OS and standard-library specific, and it is this project's one honest caveat.
parts:
  - name: 'The service model and state machine'
    count: 5
  - name: 'Lifecycle over the fake runtime'
    count: 6
  - name: 'Restart policies'
    count: 4
  - name: 'Backoff and crash-loop protection'
    count: 5
  - name: 'Dependencies and start ordering'
    count: 5
  - name: 'The supervisor loop, shutdown, and the capstone'
    count: 5
caveats:
  note: 'The supervisor core is fully real and test-driven, and the runnable demo drives genuine child processes through restart, backoff, crash-loop give-up, and signal-based shutdown, but it ships with no config-file format and only a simulated (instant) readiness check rather than a real health probe.'
  future:
    - 'Add a config file format (YAML, TOML, or JSON) so you can describe your own services instead of using the hardcoded demo list.'
    - 'Implement a real readiness check (an HTTP or TCP probe, or a pidfile) instead of marking every service ready the instant it is spawned.'
    - 'Teach Reconcile to respect a service''s pending restart-backoff timer directly, so it is safe to call repeatedly without the entry point''s ramp-up then tick workaround.'
    - 'Add a way to cancel a crash-looping service''s pending restart when shutdown begins, instead of leaving it in Exited by convention.'
    - 'Add per-service log prefixing so each child''s output is distinguishable instead of interleaved on one stream.'
    - 'Run each child in its own process group so a SIGKILL to the supervisor itself does not orphan its children.'
resources:
  - title: 'systemd.service - Service unit configuration'
    url: 'https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html'
    note: 'The reference for a real service manager. Read the Restart=, RestartSec=, and Type= (readiness) options - the restart policies and readiness model this project builds in miniature.'
  - title: 'runit - a UNIX init scheme'
    author: 'Gerrit Pape'
    url: 'http://smarden.org/runit/'
    note: 'A tiny, elegant supervision scheme: one supervise process per service, restart on exit, clean signalling. The design writeup shows how little a correct supervisor actually needs.'
  - title: 'daemontools'
    author: 'Daniel J. Bernstein'
    url: 'https://cr.yp.to/daemontools.html'
    note: 'The ancestor of runit and the modern supervise-one-service model. supervise, svc, and svstat show the minimal state and signalling a supervisor is built from.'
  - title: 'Supervisor: A Process Control System'
    url: 'http://supervisord.org/'
    note: 'A userland supervisor with explicit start/stop/restart states, autorestart policies, startretries, and startsecs. Its documented state machine closely parallels the lifecycle and crash-loop protection built here.'
  - title: 'Erlang/OTP Supervisor Behaviour'
    url: 'https://www.erlang.org/doc/system/sup_princ.html'
    note: 'The origin of supervision trees: restart strategies, intensity/period crash-loop limits, and child-order start and reverse-order shutdown - the principles behind this project''s backoff, give-up, and dependency ordering.'
  - title: 'The systemd unit dependency and ordering model'
    url: 'https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html'
    note: 'Requires=, After=, and Before= define the dependency graph and start/stop ordering. The topological start order and reverse-order shutdown chapter is a direct, simplified model of this.'
---
