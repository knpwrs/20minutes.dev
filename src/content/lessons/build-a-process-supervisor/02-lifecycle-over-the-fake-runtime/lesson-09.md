---
project: build-a-process-supervisor
lesson: 9
title: Stopping a running service
overview: To stop a service the supervisor does not yank it away - it politely asks the process to exit by sending SIGTERM, then waits. Today you add Stop, which signals the service's handle and moves it into the Stopping state.
goal: Stop a running service by sending SIGTERM to its handle and entering Stopping.
spec:
  scenario: Stop signals the process and enters Stopping
  status: failing
  lines:
    - kw: Given
      text: 'a Running service "web" holding handle h from the runtime'
    - kw: When
      text: 'Stop("web") is called'
    - kw: Then
      text: 'the runtime recorded a SIGTERM delivered to handle h, and the service State is Stopping'
    - kw: And
      text: 'the process has not been reaped yet - the service is Stopping, not Stopped (it is waiting for the process to actually exit)'
code:
  lang: go
  source: |
    func (s *Supervisor) Stop(name string) {
      svc, _ := s.Get(name)
      if svc.State != Running { return }
      s.rt.Signal(svc.Handle, SIGTERM) // ask it to exit
      svc.State = Stopping              // waiting for the exit
    }
checkpoint: Stopping a service sends SIGTERM and enters Stopping. Commit and stop here.
---

Stopping a process cleanly is a request, not a demand. The supervisor sends
**SIGTERM** - the signal that means "please shut down" - and the process gets to
flush its buffers, close its connections, and exit on its own terms. Crucially, the
service does not become `Stopped` the instant you send the signal: the process is
still alive, still cleaning up. It is in `Stopping`, an in-between state that means
"we have asked; we are waiting."

That waiting matters. A well-behaved process exits promptly after SIGTERM, but a
stuck one might ignore it entirely - which is exactly why a real supervisor
escalates to SIGKILL after a grace period (a lesson you reach at the end). For now,
`Stop` sends the polite signal and records that we are waiting. The moment the
process actually exits is a separate event - the **reap** - and that is next.
