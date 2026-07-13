---
project: build-a-green-thread-scheduler
lesson: 4
title: The scheduler loop
overview: Now the runtime comes alive. The scheduler loop pulls a task, steps it, and acts on the status it returns - re-enqueue on Ready, drop on Done - until nothing is left. Today a single self-driving task proves the loop resumes a task across many steps.
goal: Write Run - dequeue a task, step it, re-enqueue on Ready and drop on Done, until the queue is empty.
spec:
  scenario: One task is resumed until it finishes
  status: failing
  lines:
    - kw: Given
      text: 'a task that returns Ready on its first two steps and Done on the third'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the task is stepped exactly 3 times and the run queue ends empty'
    - kw: And
      text: 'a task that returns Done on its first step is stepped exactly once'
code:
  lang: go
  source: |
    func (s *Scheduler) Run() {
      for s.rq.len() > 0 {
        t := s.rq.dequeue()
        switch t.step() {
        case Ready:
          s.rq.enqueue(t) // yielded - back of the line
        case Done:
          // finished - drop it
        }
      }
    }
checkpoint: The scheduler loop resumes a task across steps until it is Done. Commit and stop here.
---

This is the beating heart of a cooperative runtime, and it is astonishingly small:
take the task at the front, **step it once**, and look at what it returns. `Ready`
means "I did a little work and yielded" - so put it at the **back** of the queue to
run again later. `Done` means "I finished" - so drop it. Repeat until the queue is
empty. There is no preemption anywhere: the loop never interrupts a step, it only
acts between steps.

A task that needs several steps to finish is a little **state machine** - it
remembers how far it has got and returns `Ready` until its last step returns `Done`.
Stepping such a task three times to completion is the whole idea of resumption, done
with one task so no interleaving distracts from it. (`Blocked` also comes back from
`step`, but no task parks itself yet - that is Chapter 3, so the loop can ignore it
for now.)
