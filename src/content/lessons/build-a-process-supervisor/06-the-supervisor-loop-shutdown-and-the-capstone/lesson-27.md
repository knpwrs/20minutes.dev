---
project: build-a-process-supervisor
lesson: 27
title: A status report
overview: An operator needs to see, at a glance, what every service is doing. Today you produce a status report - each service's name, state, and restart count - the supervisor's answer to "how are things?"
goal: Produce a deterministic status line for every service - name, state, and restart count.
spec:
  scenario: The report lists every service in order
  status: failing
  lines:
    - kw: Given
      text: 'services in insertion order: "db" Running (0 restarts), "web" Running (0 restarts), "flaky" Failed (3 restarts)'
    - kw: When
      text: 'Status() is called'
    - kw: Then
      text: 'it returns one line per service in insertion order: "db running 0", "web running 0", "flaky failed 3"'
    - kw: And
      text: 'the lines use the State.String() names from lesson 2, so the states read "running" and "failed"'
code:
  lang: go
  source: |
    func (s *Supervisor) Status() []string {
      var out []string
      for _, name := range s.order { // insertion order, deterministic
        svc, _ := s.Get(name)
        out = append(out, fmt.Sprintf("%s %s %d",
          svc.Name, svc.State, svc.RestartCount))
      }
      return out
    }
checkpoint: The supervisor reports every service's name, state, and restart count. Commit and stop here.
---

A supervisor that manages a dozen services is useless if you cannot see what it is
doing. Every real one has this surface - `systemctl status`, `svstat`,
`supervisorctl status` - a plain listing of each service's name, current state, and
how many times it has been restarted. It is the operator's window into the machine,
and the last piece before the capstone can assert a whole system's condition in one
value.

The report is simple by design: walk the services in the insertion order you have
kept since lesson 3, and for each print its name, its `State` through the
`String()` labels from lesson 2, and its restart count. Determinism is the point - a
fixed order and stable labels mean the report is a value you can assert exactly, both
in the capstone and when you eyeball a running system. This turns all the internal
state you have been tracking into something a human, or a test, can read at a glance.
