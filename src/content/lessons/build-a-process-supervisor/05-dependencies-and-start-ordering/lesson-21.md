---
project: build-a-process-supervisor
lesson: 21
title: Declaring dependencies
overview: Services rarely stand alone - a web server needs its database first. Today you let a service declare which other services it depends on, and have the supervisor reject a dependency on something it does not manage.
goal: Give a service a list of dependencies and validate that each names a known service.
spec:
  scenario: Dependencies must name registered services
  status: failing
  lines:
    - kw: Given
      text: 'a supervisor managing "db" and "web", where "web" declares Requires ["db"]'
    - kw: When
      text: 'Validate() is called'
    - kw: Then
      text: 'it returns no error, and web''s Requires is ["db"]'
    - kw: And
      text: 'if "web" instead requires ["cache"] which is not registered, Validate() returns an error naming the unknown dependency "cache"'
code:
  lang: go
  source: |
    // Service gains: Requires []string
    func (s *Supervisor) Validate() error {
      for _, name := range s.Names() {
        svc, _ := s.Get(name)
        for _, dep := range svc.Requires {
          if _, ok := s.Get(dep); !ok {
            return fmt.Errorf("service %q requires unknown service %q", svc.Name, dep)
          }
        }
      }
      return nil
    }
checkpoint: Services declare dependencies and the supervisor rejects unknown ones. Commit and stop here.
---

Real systems have ordering constraints: the web server must not start before the
database is up, the worker needs the message queue first. A supervisor captures this
as a **dependency** - service `web` `Requires` service `db` - which is systemd's
`Requires=` and `After=` in miniature. Today just declares them: each service
carries a list of the names it depends on.

Before any of that can be trusted, the graph has to be sound. A dependency on a
service the supervisor does not even manage is a configuration error, and catching
it early - with a clear message naming the culprit - beats a confusing failure at
start time. This validation is the first of two soundness checks; the second, that
the dependencies do not form a cycle, comes once you can compute an order to check
against.
