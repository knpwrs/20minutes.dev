---
project: build-an-http-server
lesson: 23
title: Route by path
overview: A real server answers different paths differently. Today you build a router that maps a method and path to a handler, so "/" and "/about" return different pages.
goal: Register handlers keyed by method and path, and dispatch a request to the matching one.
spec:
  scenario: Dispatching to a handler by path
  status: failing
  lines:
    - kw: Given
      text: 'a router with GET "/" returning body "home" and GET "/about" returning body "about"'
    - kw: When
      text: 'a request for GET "/about" is dispatched'
    - kw: Then
      text: 'the response body is "about"'
code:
  lang: go
  source: |
    type Handler func(Request) Response
    type Mux struct{ routes map[string]Handler }
    func key(method, path string) string { return method + " " + path }
    func (m *Mux) Handle(method, path string, h Handler) { m.routes[key(method, path)] = h }
    func (m *Mux) dispatch(r Request) Response { return m.routes[key(r.Method, r.Path)](r) }
checkpoint: 'Requests dispatch to a handler by method and path. Commit.'
---

A server that returns the same body for every path is not much of a server. A
**router** (often called a mux) fixes that: it holds a table of registered routes
and picks the `Handler` whose method and path match the request. Handlers take a
`Request` and return a `Response` — the two types the chapters built.

Key the table on **both** method and path from the very start, even though you
only register `GET` routes today. It costs nothing now and means the next lessons
— a 404 for unknown paths, a 405 for the wrong method — slot in without reworking
the table's shape.
