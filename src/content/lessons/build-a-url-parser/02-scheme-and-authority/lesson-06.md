---
project: build-a-url-parser
lesson: 6
title: Breaking the authority into a host
overview: The authority you captured as one string actually has up to three parts - userinfo, host, and port. Today you start decomposing it by pulling out the host in the simplest case, where the authority is nothing but a registered name.
goal: Split the raw authority into its sub-components, handling the plain host-only case.
spec:
  scenario: A host-only authority
  status: failing
  lines:
    - kw: Given
      text: 'the input "//example.com/index.html"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Host is "example.com", HasUserinfo is false, and HasPort is false'
    - kw: And
      text: 'the Authority field still holds the raw "example.com"'
code:
  lang: go
  source: |
    // called after the authority string is captured
    func parseAuthority(u *URI) {
      a := u.Authority
      // no '@' and no ':' yet -> the whole thing is the host
      u.Host = a
    }
checkpoint: The authority now yields a Host in the simplest case. Commit and stop here.
---

The authority has the shape `[ userinfo "@" ] host [ ":" port ]` - an optional userinfo ending in `@`, a mandatory host, and an optional port introduced by a colon. The **host** is the only required piece and the common case is an authority that is nothing else: a **registered name** like `example.com`, a dotted label that a name service resolves. Start there. With no `@` and no `:` in the authority, the entire string is the host, and userinfo and port are both absent.

Keep the raw `Authority` string intact while you fill in the sub-fields beside it - later, recomposing a URI is easiest from the raw authority, and reference resolution copies the authority around as a unit. This lesson establishes the `parseAuthority` step that runs whenever `HasAuthority` is true; the next two lessons teach it to peel off the userinfo and the port before the host, so that by the end the three sub-components are all separated.
