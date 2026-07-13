---
project: build-an-http-server
lesson: 25
title: Return 405 for the wrong method
overview: A path may exist but not for the method used - POST-only endpoints should reject a GET with 405, not 404. Today you tell "no such path" apart from "wrong method for this path".
goal: Return 405 Method Not Allowed with an Allow header when a path exists but not for the requested method.
spec:
  scenario: Path exists, method does not
  status: failing
  lines:
    - kw: Given
      text: 'a router with only POST "/submit" registered'
    - kw: When
      text: 'a request for GET "/submit" is dispatched'
    - kw: Then
      text: 'the response status is 405 and it has header "Allow: POST"'
code:
  lang: go
  source: |
    // exact method+path missed; is the PATH known under any method?
    if allowed := m.methodsFor(r.Path); len(allowed) > 0 {
        return Response{Status: 405,
            Headers: map[string]string{"Allow": strings.Join(allowed, ", ")}}
    }
    // otherwise fall through to 404
checkpoint: 'A known path with the wrong method returns 405 with an Allow header. Commit.'
---

A `404` says the resource does not exist; a **`405 Method Not Allowed`** says it
exists but not for the method you used — `GET`ting an endpoint that only accepts
`POST`, say. Distinguishing them means that after an exact method-and-path miss
you check whether the **path** is registered under *any* method.

When it is, answer `405` and include an **`Allow`** header listing the methods
that path does accept — the spec requires it, and clients use it to retry
correctly. This is exactly why lesson 23 keyed the table on method and path
together: the information you need is already there to scan.
