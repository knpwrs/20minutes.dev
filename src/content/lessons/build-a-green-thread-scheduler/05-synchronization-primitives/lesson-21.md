---
project: build-a-green-thread-scheduler
lesson: 21
title: A mutex
overview: A mutex is a semaphore of one permit - the primitive that guarantees only a single green thread is in a critical section at a time. Today you build lock and unlock with a FIFO waiter queue, and pin the exact hand-off when a holder unlocks with others waiting.
goal: Build a mutex whose unlock hands the lock to the first waiter in FIFO order.
spec:
  scenario: Lock is handed to waiters in arrival order
  status: failing
  lines:
    - kw: Given
      text: 'a mutex, and tasks 1, 2, 3 spawned in order; task 1 locks, enters, yields, then unlocks; tasks 2 and 3 try to lock while 1 holds it'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'task 2 (which tried to lock first) gets the lock before task 3, giving entry order [1, 2, 3]'
    - kw: And
      text: 'the run trace is exactly [1, 2, 3, 1, 2, 3] and the mutex ends unlocked'
code:
  lang: go
  source: |
    type Mutex struct { locked bool; wq WaitQueue; s *Scheduler }
    // Lock: if free, take it; else park (resume owning the lock).
    // Unlock: if anyone waits, hand ownership to the front waiter (stay locked);
    //         else set locked = false.
    // A mutex is exactly a Sem with count 1 - you can build it on Sem.
checkpoint: A mutex serializes a critical section and hands off FIFO on unlock. Commit and stop here.
---

A **mutex** (mutual exclusion lock) is the special, ubiquitous case of a semaphore
with a single permit: at most one task holds it, so at most one task is ever inside
the code it guards. Everything you learned about the semaphore's hand-off applies -
unlocking with waiters present passes ownership straight to the front waiter, keeping
the lock continuously held, so no third task can slip in between.

The FIFO hand-off is what today pins down. Task 1 locks and yields while holding the
lock; tasks 2 and 3 both try to lock and both block, joining the wait queue in that
order. When task 1 unlocks, ownership goes to task 2 (first to wait), which enters,
then unlocks to task 3. Entry order is `[1, 2, 3]` and the trace is `[1, 2, 3, 1, 2,
3]` - strict, fair serialization. Build it directly on the semaphore if you like; a
mutex is just `Sem{count: 1}` with friendlier names.
