---
project: build-a-dns-resolver
lesson: 26
title: RCODE and truncation
overview: Before trusting a response's answers, a resolver must read its status - the RCODE and the truncation bit. Today you turn a failed or truncated reply into a clear error instead of silently returning empty answers.
goal: Reject NXDOMAIN and truncated responses, and return answers only on success.
spec:
  scenario: Status flags decide success, failure, or truncation
  status: failing
  lines:
    - kw: Given
      text: 'four parsed responses: one with RCODE 0 and an A answer, one with RCODE 3 (NXDOMAIN), one with RCODE 2 (SERVFAIL), and one with the TC bit set'
    - kw: When
      text: 'each is checked for usable answers'
    - kw: Then
      text: 'the RCODE 0 response yields its answers, and the RCODE 3 response returns an NXDOMAIN error'
    - kw: And
      text: 'the RCODE 2 response returns a generic server-failure error, and the TC response returns a truncation error (signaling the reply did not fit and would need a retry over TCP)'
code:
  lang: go
  source: |
    func (m Message) result() ([]RR, error) {
      if m.Header.Flags&flagTC != 0 {
        return nil, errTruncated
      }
      switch rcode(m.Header.Flags) {
      case 0: return m.Answers, nil
      case 3: return nil, errNXDomain
      // other non-zero codes: a generic server-failure error
      }
    }
checkpoint: The resolver honors RCODE and truncation. Commit and stop here.
---

A response can carry a **status** as well as data, and a resolver must read it
before using the answers. The **RCODE** (the low nibble of the flags word from
lesson 4) reports the outcome: `0` is success, `3` is **NXDOMAIN** - the name
genuinely does not exist - and other non-zero codes are failures like SERVFAIL.
Returning an NXDOMAIN as if it were merely an empty answer would be a lie, so map a
non-zero RCODE to a clear error.

The **TC** (truncated) bit is the other guard. UDP responses are size-limited, and
when an answer will not fit the server sends what it can and sets TC to say "there
is more - ask again over TCP." Since our transport is UDP-style, a truncated reply
is incomplete, so the resolver reports a truncation error rather than trusting a
partial answer. Reading these two status signals is what separates a resolver that
handles the real world from one that only works on perfect replies. Now the
resolver can tell success from failure, it can start chasing multi-step answers.
