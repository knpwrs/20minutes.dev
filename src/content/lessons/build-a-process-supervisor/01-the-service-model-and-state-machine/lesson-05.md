---
project: build-a-process-supervisor
lesson: 5
title: The fake process runtime
overview: The supervisor must never call fork and exec directly, or nothing about it would be testable. Instead it talks to a process runtime through a small interface. Today you define that interface and a fake implementation that records what it was asked to do, so every later lesson can drive processes deterministically.
goal: Define a Runtime interface and a fake that records started commands and delivered signals.
spec:
  scenario: The fake runtime records starts and signals
  status: failing
  lines:
    - kw: Given
      text: 'a FakeRuntime'
    - kw: When
      text: 'Start("run-web") is called, then Start("run-db"), then Signal(h1, SIGTERM) on the first handle'
    - kw: Then
      text: 'the two Start calls return distinct handles (1 and 2), Started(h1) is "run-web", and Started(h2) is "run-db"'
    - kw: And
      text: 'Signals(h1) is [SIGTERM] and Signals(h2) is empty'
code:
  lang: go
  source: |
    type Handle int
    type Signal int
    const ( SIGTERM Signal = iota; SIGKILL )
    type Runtime interface {
      Start(cmd string) Handle
      Signal(h Handle, sig Signal)
    }
    // FakeRuntime hands out handles 1,2,3... and records cmd + signals per handle
    type FakeRuntime struct { /* next Handle; started map; signals map */ }
checkpoint: A fake runtime records every start and signal, with no real processes involved. Commit and stop here.
---

If the supervisor called the operating system to fork and exec real programs, you
could not test a single restart decision without spawning actual processes and
racing against wall-clock time. The fix is the oldest trick in testable design:
put a thin **interface** between the supervisor and the world. The supervisor only
ever asks a `Runtime` to `Start` a command (getting back an opaque **handle**) or to
send a `Signal` to a handle. It never knows or cares whether a real process exists.

The `FakeRuntime` implements that interface by simply writing down what it was told:
which command each handle was started with, and which signals each handle received.
That record is what your tests assert against. The real, fork-and-exec runtime is
the one piece that genuinely differs per operating system, so it lives outside the
graded core entirely - the supervisor you build is identical everywhere, and this
interface is the seam that makes that true. One thing is still missing: a way to say
"this process exited". That is the reaping step, and it arrives with the lifecycle
next.
