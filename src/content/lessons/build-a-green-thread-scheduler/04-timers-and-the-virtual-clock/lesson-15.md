---
project: build-a-green-thread-scheduler
lesson: 15
title: The virtual clock
overview: Green threads need to wait for time, not just for other tasks. But real time is untestable, so the runtime keeps a virtual clock - a plain integer that only moves when nothing else can run. Today a task sleeps, and the scheduler jumps the clock forward to wake it.
goal: Add a virtual clock and Sleep, and advance the clock to wake a sleeper when the run queue empties.
spec:
  scenario: A sleeping task wakes when the clock reaches its deadline
  status: failing
  lines:
    - kw: Given
      text: 'a fresh scheduler with the clock Now() at 0, and a task that sleeps for 5 then finishes'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the task parks, the run queue empties, the clock advances to 5, the task resumes and finishes, and Now() is 5'
    - kw: And
      text: 'the task is stepped exactly twice - once before sleeping and once after waking'
code:
  lang: go
  source: |
    type timer struct { at int; task *Task }
    // Sleep parks the current task with a wake time of now + d
    func (s *Scheduler) Sleep(d int) Status {
      s.timers = append(s.timers, timer{at: s.now + d, task: s.current})
      return Blocked
    }
    // in Run, when the run queue is empty but timers remain:
    //   advance s.now to the earliest timer's at, move due timers to the run queue
checkpoint: A task can sleep and the virtual clock advances to wake it. Commit and stop here.
---

Waiting for time is different from waiting for another task: nobody is going to
`Wake` a sleeper - the passage of time is what should. So the runtime models time
itself as a **virtual clock**, `now`, a simple counter that starts at 0. `Sleep(d)`
parks the current task in a **timer** set with a wake time of `now + d`, just like
blocking but recorded against a deadline instead of a wait queue.

The key rule - the one that keeps everything deterministic - is *when* the clock
moves. It does **not** tick along on its own. It advances only when the run queue is
empty, meaning no ready task can make progress, and then it jumps straight to the
earliest pending deadline. Here the task sleeps 5, the queue empties, and `now` leaps
from 0 to 5 to wake it. Virtual time never passes while there is work to do, so two
runs of the same program always produce the same timeline.
