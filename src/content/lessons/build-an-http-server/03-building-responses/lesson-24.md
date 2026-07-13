---
project: build-an-http-server
lesson: 24
title: Return 404 for unknown paths
overview: When no route matches, the server must say so with a 404 rather than crashing on a missing handler. Today you add that fallback to the router.
goal: Dispatch to a 404 Not Found response when no registered route matches the request.
spec:
  scenario: No route matches
  status: failing
  lines:
    - kw: Given
      text: 'a router with only GET "/" registered'
    - kw: When
      text: 'a request for GET "/missing" is dispatched'
    - kw: Then
      text: 'the response status is 404 and the body is "Not Found"'
code:
  lang: go
  source: |
    h, ok := m.routes[key(r.Method, r.Path)]
    if !ok {
        return Response{Status: 404, Body: []byte("Not Found")}
    }
    return h(r)
checkpoint: 'Unknown paths return a clean 404. Commit.'
---

Looking a route up in a map has two outcomes, and until now you only handled one.
When the key is absent, indexing a Go map returns a nil handler that panics when
called — so the router must **check** whether the route exists and, when it does
not, produce a `404 Not Found` itself.

This is the first status code the server chooses on its own rather than always
returning `200`. The reason phrase comes free from the table you seeded in lesson
18. A missing route is now a clean, well-formed response instead of a dropped
connection.
