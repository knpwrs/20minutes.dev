---
title: 'Build a Green-Thread Scheduler'
order: 34
lessons: 32
size: 'Small'
tech: ['Cooperative scheduling', 'Coroutines', 'Event loops']
estMin: 20
desc: 'Build a cooperative green-thread scheduler from first principles - a single-threaded, deterministic user-space runtime over a virtual clock. Model a green thread as a resumable task that steps and returns a status (Ready, Blocked, or Done), then build a FIFO run queue, yielding and round-robin interleaving, wait queues for blocking and waking, a virtual-clock timer heap, and synchronization primitives (a semaphore, a mutex, buffered and unbuffered channels, a wait group) all built on block and wake - ending in a runtime that runs a set of cooperating green threads and reports their exact interleaved step order and virtual timeline.'
blurb: 'The scheduler is the single driver, so every run order is exact and testable - no OS threads, no preemption, no real concurrency. Each lesson pins one deterministic trace: two yielding tasks producing an exact A,B,A,B, a blocked task that is not run until woken, FIFO wake order among several waiters, two sleepers waking in deadline order with the clock advancing only when the run queue is empty, a buffered send that does not block until the buffer is full while an unbuffered send blocks until a receiver arrives, a semaphore permitting exactly N, and an all-blocked-with-no-timer run reported as a deadlock instead of a hang.'
overview: |
  Over 32 lessons you build a cooperative green-thread scheduler from scratch: a single-threaded, deterministic user-space runtime that multiplexes many lightweight tasks onto one driver over a virtual clock. A green thread is modelled as a resumable task - a step function that advances a little each time it is run and returns a status: Ready (it yielded and should run again), Blocked (it is parked on a resource), or Done. Because the scheduler is the only thing running, every interleaving is exact and reproducible, so each lesson pins a concrete step trace, wake order, or virtual-clock value you can assert against.

  You start with a FIFO run queue and a scheduler loop that runs one task to completion, then add cooperative yielding and round-robin interleaving (the exact A,B,A,B trace), wait queues so a task can block and later be woken in FIFO order, a virtual clock with sleeping tasks and a timer ordering that advances the clock only when nothing else can run, and a family of synchronization primitives - a counting semaphore, a mutex, buffered and unbuffered channels with close, and a wait group - all built on the same block-and-wake core. The final chapters add a priority policy, deadlock detection so an all-blocked run reports cleanly instead of hanging, task cancellation that wakes a cancelled task's joiners, and a capstone that runs cooperating green threads - a producer and consumer over a channel, two sleepers, and a fan-in join - asserting the exact execution order, the virtual time each task wakes, and the final results.

  This is a teaching-grade cooperative runtime, deliberately honest about its model: it is single-threaded and cooperative (a task keeps the CPU until it yields or blocks - there is no preemption), it uses a virtual clock rather than real time, and tasks are resumable step functions rather than OS threads with real saved stacks. That exact model is what keeps every result deterministic and language-neutral - the same design at the heart of Python's asyncio, early Go, and every async runtime, minus the real-time I/O, multi-core parallelism, and stack switching those production systems layer on top.
parts:
  - name: 'Tasks and the run queue'
    count: 5
  - name: 'Yielding and cooperative interleaving'
    count: 4
  - name: 'Blocking and waking'
    count: 5
  - name: 'Timers and the virtual clock'
    count: 5
  - name: 'Synchronization primitives'
    count: 7
  - name: 'Policy, cancellation, and the capstone'
    count: 6
caveats:
  note: 'The scheduler''s core cooperative / virtual-clock / deadlock-detection model is solid and misuse-hardened - it runs cooperating green threads with an exact, reproducible interleaving and timeline - but it is deliberately single-threaded and cooperative (no preemption, so a task that never yields starves the rest), uses a virtual clock rather than real time, models tasks as resumable step-function state machines rather than real saved stacks, and still lacks generics, a select / timeout primitive, and public task introspection that a production runtime would need.'
  future:
    - 'Add a timeout form for blocking operations (a Recv or Acquire that gives up after a virtual deadline) so a task can stop waiting instead of only succeeding or deadlocking'
    - 'Add a select-style multi-wait across several channels and timers, mirroring Go''s own select, so a task can wait on the first of many events'
    - 'Make the channel carry any value type instead of hardcoding integers (generic Chan[T]), so real payloads can flow between green threads'
    - 'Expose task introspection (an id and a done or cancelled status) so external code can observe a task without reaching into the scheduler''s internals'
    - 'Recover from a panicking task step inside the run loop instead of letting one misbehaving green thread crash the whole scheduler'
    - 'Add a starvation guard - a yield budget or lane aging - so a greedy high-priority task cannot freeze out lower-priority work'
resources:
  - title: 'Coroutines (ACM Computing Surveys - Revisiting Coroutines)'
    author: 'Ana Lucia de Moura, Roberto Ierusalimschy'
    url: 'https://dl.acm.org/doi/10.1145/1462166.1462167'
    note: 'The clearest modern account of what a coroutine is - symmetric versus asymmetric, stackful versus stackless - and how cooperative multitasking is built from resumable control transfer. The theoretical backbone of modelling a green thread as a resumable task.'
  - title: 'The Art of Computer Programming, Volume 1: Fundamental Algorithms'
    author: 'Donald E. Knuth'
    note: 'Section 1.4.2 introduces coroutines as the fundamental generalization of the subroutine - two routines that resume each other rather than one calling the other. The original rigorous treatment of the cooperative-transfer idea this project rests on.'
  - title: 'Cooperation of Cooperating Sequential Processes (and the semaphore)'
    author: 'Edsger W. Dijkstra'
    url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD01xx/EWD123.html'
    note: 'Dijkstra''s EWD123, where P/V semaphores and the discipline of blocking and waking cooperating processes are laid out. The direct ancestor of the semaphore, mutex, and wait-queue primitives built in Chapter 5.'
  - title: 'Developing with asyncio (event loop and coroutines)'
    author: 'Python Software Foundation'
    url: 'https://docs.python.org/3/library/asyncio-eventloop.html'
    note: 'The reference for a real single-threaded cooperative event loop: a run queue of ready callbacks, scheduled timers, and coroutines that suspend at await points. The production system whose core this project reconstructs from scratch.'
  - title: 'Build Your Own Async'
    author: 'Nathaniel J. Smith'
    url: 'https://www.youtube.com/watch?v=Y4Gt3Xjd7G8'
    note: 'A from-scratch walkthrough building an async runtime out of generators, a scheduler loop, and a wait/wake queue - the practical companion to this project, showing how yields, sleeps, and blocking I/O become a cooperative event loop.'
  - title: 'Cooperative multitasking'
    author: 'Wikipedia'
    url: 'https://en.wikipedia.org/wiki/Cooperative_multitasking'
    note: 'A concise survey of cooperative (non-preemptive) multitasking and its history, contrasting a task that voluntarily yields the CPU with preemptive scheduling - the exact distinction that defines this project''s honest scope.'
---
