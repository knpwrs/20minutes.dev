---
project: build-an-agent-harness
lesson: 24
title: Which errors are worth retrying
overview: Not every failed request deserves another attempt. Today you build the classifier that tells a request worth repeating apart from one that will only ever fail the same way.
goal: Build an IsRetryable classifier that marks 429 and any 5xx error as retryable, and 400 and 401 as not.
spec:
  scenario: Classifying which API errors are worth a retry
  status: failing
  lines:
    - kw: Given
      text: 'five API errors - a 400 invalid_request_error, a 401 authentication_error, a 429 rate_limit_error, a 500 api_error, and a 529 overloaded_error'
    - kw: When
      text: each is checked for whether it is worth retrying
    - kw: Then
      text: 'the 400 and the 401 are not retryable - retrying either would send the exact same request and get the exact same failure'
    - kw: And
      text: 'the 429, the 500, and the 529 are all retryable - each describes a condition that can plausibly clear before the next attempt'
code:
  lang: go
  source: |
    // worth retrying: 429 (rate limited) and any 5xx (server-side); never
    // a 4xx that isn't 429 - repeating a bad request only fails the same way
    func IsRetryable(status int) bool {
        return false // replace with: 429 or status >= 500
    }
checkpoint: You can now tell, from a failed request's status alone, whether trying again is worth doing at all. Commit and stop for today.
---

A failed request is not automatically worth another attempt. A `400 invalid_request_error` means the request itself was malformed - sending the identical bytes again produces the identical error, every time. A `401 authentication_error` means the key is wrong; no amount of waiting fixes that. Retrying either wastes a request and delays telling the caller about a problem retrying can never solve.

`429 rate_limit_error` and the `5xx` family are the opposite case: a rate limit clears with time, and a `500` or `529` describes the server's own trouble, not anything wrong with what you sent. Both are worth a second try. The classifier is nothing more than reading the status back off the failed request, but drawing this line correctly is what the next lesson's retry loop leans on entirely - it has to know, before it sleeps and tries again, whether trying again could possibly help.
