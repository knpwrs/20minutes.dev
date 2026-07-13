---
project: build-an-http-client
lesson: 37
title: Which redirects change the method
overview: The redirect status code decides whether the follow-up repeats your POST or switches to a GET. Today you pin that rule - the one place the 3xx codes genuinely differ.
goal: Decide the follow-up method and whether to keep the body from the redirect status and original method.
spec:
  scenario: Method changes across a redirect
  status: failing
  lines:
    - kw: Given
      text: 'a redirect received in response to a POST request'
    - kw: When
      text: the follow-up method is decided from the status code
    - kw: Then
      text: 'a 303 uses GET and drops the body, while a 307 keeps POST and keeps the body'
    - kw: And
      text: 'a 302 uses GET and drops the body, and a 308 keeps POST and keeps the body'
code:
  lang: go
  source: |
    // 303           -> always GET, drop the body
    // 307, 308      -> preserve the method AND the body
    // 301, 302      -> a POST becomes GET (drop body); GET/HEAD unchanged
    func redirectMethod(status int, method string) (newMethod string, keepBody bool) {
      // switch on status; return the method + whether to resend the body
    }
checkpoint: The client picks the correct follow-up method and body for each redirect code. Commit and stop here.
---

This is the one place the redirect codes genuinely diverge, and it is worth pinning
exactly. **303 See Other** always switches the follow-up to `GET` and drops the body
- it exists precisely to turn a POST into a GET of some result page. **307 Temporary
Redirect** and **308 Permanent Redirect** are the opposite: they **preserve the
method and the body**, so a POST stays a POST. The older **301** and **302** are
messier - the specification says preserve, but browsers historically turned POST into
GET, and real clients follow that convention.

So for a POST, a 303 or 302 sends a bodyless GET to the new location, while a 307 or
308 re-sends the whole POST. Getting this right is what keeps a redirect from either
losing data or re-submitting a form unexpectedly. It is a small function, but it
encodes a genuine and often-misunderstood rule of HTTP.
