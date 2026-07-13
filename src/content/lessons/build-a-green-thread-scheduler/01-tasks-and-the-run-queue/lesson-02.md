---
project: build-a-green-thread-scheduler
lesson: 2
title: The FIFO run queue
overview: The scheduler needs somewhere to keep the tasks that are ready to run. That is the run queue - a plain first-in, first-out line. Today you build it, because the order tasks leave this queue is what makes every later interleaving exact.
goal: Build a first-in, first-out run queue with enqueue, dequeue, and length.
spec:
  scenario: Tasks leave the queue in arrival order
  status: failing
  lines:
    - kw: Given
      text: 'an empty run queue'
    - kw: When
      text: 'tasks A, B, then C are enqueued and then dequeued three times'
    - kw: Then
      text: 'they come out in the order A, B, C'
    - kw: And
      text: 'the length reports 3 after the enqueues and 0 after the three dequeues'
code:
  lang: go
  source: |
    // a queue is just a slice used front-to-back
    type runq struct{ items []*Task }
    func (q *runq) enqueue(t *Task) { q.items = append(q.items, t) } // to the back
    func (q *runq) dequeue() *Task {                                  // from the front
      t := q.items[0]
      q.items = q.items[1:]
      return t
    }
    func (q *runq) len() int { return len(q.items) }
checkpoint: You have a FIFO run queue that preserves arrival order. Commit and stop here.
---

Cooperative scheduling is fair because it is **first-in, first-out**: a task that
becomes ready waits behind everyone who was already waiting, and no task can jump
the line. That single rule is what makes round-robin interleaving deterministic
later - when two tasks both yield, the one that yielded first runs first.

Today the queue is a plain slice: enqueue appends to the **back**, dequeue removes
from the **front**. That is the whole data structure. Keeping enqueue-at-back and
dequeue-at-front straight now matters enormously - reverse them and every trace in
this project comes out backwards. The scheduler you build next lesson does nothing
but pull from this queue.
