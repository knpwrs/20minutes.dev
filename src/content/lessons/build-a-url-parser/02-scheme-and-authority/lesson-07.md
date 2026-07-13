---
project: build-a-url-parser
lesson: 7
title: Pulling out the userinfo
overview: When an authority carries a user component, it comes first and ends at an at-sign. Today you split that userinfo off the front of the authority, keeping the present-but-empty distinction you built earlier.
goal: Split the userinfo before the at-sign out of the authority.
spec:
  scenario: Userinfo before the at-sign
  status: failing
  lines:
    - kw: Given
      text: 'the input "//jane:secret@example.com/"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'HasUserinfo is true, Userinfo is "jane:secret", and Host is "example.com"'
    - kw: And
      text: 'Parse("//@example.com") has HasUserinfo true with Userinfo "", and Parse("//example.com") has HasUserinfo false'
code:
  lang: go
  source: |
    // userinfo is everything before the FIRST '@' in the authority
    if i := strings.IndexByte(a, '@'); i >= 0 {
      u.Userinfo = a[:i]
      u.HasUserinfo = true
      a = a[i+1:] // host (and maybe port) is what remains
    }
checkpoint: parseAuthority now separates the userinfo from the host. Commit and stop here.
---

The **userinfo** holds user-identity data - classically `user:password`, though the password form is deprecated for obvious reasons. When present it sits at the front of the authority and is terminated by the first `@`; everything after that at-sign is the host and optional port. So split on the first `@`: what precedes it is the userinfo, what follows continues on to host parsing.

The same present-versus-absent care from the fragment applies here. `@example.com` has an empty userinfo (someone wrote the at-sign but nothing before it), while `example.com` has no userinfo at all - and `HasUserinfo` is what tells them apart. Splitting on the *first* `@` matters too, since a colon or later characters in the host are not your concern yet; the userinfo boundary is simply that first at-sign. With userinfo removed, the remaining string is host plus a possible port, which the next lesson divides.
