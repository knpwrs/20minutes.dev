---
project: build-an-http-client
lesson: 20
title: Obsolete line folding
overview: Older servers sometimes wrap a long header value across lines, continuing it with leading whitespace. A robust client still has to read those, so today you fold a continuation line back onto its header.
goal: Fold a continuation line - one starting with a space or tab - onto the previous header value.
spec:
  scenario: Folding a wrapped header value
  status: failing
  lines:
    - kw: Given
      text: 'the header lines "X-Trace: alpha\r\n beta\r\n\r\n" (the second line begins with a space)'
    - kw: When
      text: the header block is parsed
    - kw: Then
      text: 'Get("X-Trace") is "alpha beta" - the continuation is joined to the value with a single space'
    - kw: And
      text: 'a header line that does not start with a space or tab is parsed as a new header, not a continuation'
code:
  lang: go
  source: |
    // if a header line starts with SP or HTAB, it is a CONTINUATION
    // of the previous header: strip its leading whitespace and append
    // it to the previous value, joined by a single space.
    // otherwise, parse it as a new "Name: Value" line.
checkpoint: Your parser folds continuation lines back onto their header. Commit and stop here.
---

HTTP/1.1's **obsolete line folding** let a header value span several lines by
starting each continuation with a **space or tab**. It is deprecated for senders,
but a client that talks to real servers still has to *read* it - so when a header
line begins with whitespace, it is not a new header, it is more of the previous
one. `X-Trace: alpha` followed by a line ` beta` folds into `alpha beta`.

The rule is: on a line starting with `SP` or `HTAB`, strip the leading whitespace
and append it to the previous header's value with a single joining space; on any
other line, parse a fresh `Name: Value`. This is a small branch inside the header
loop you already have, and it is the last wrinkle in reading a header block before
you handle the trickier body framings.
