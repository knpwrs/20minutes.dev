---
project: build-an-http-client
lesson: 39
title: A cookie jar
overview: A client accumulates cookies across responses in a cookie jar. Today you build one that stores cookies by name, replacing a cookie when the same name is set again.
goal: Build a cookie jar that stores cookies by name, replacing the value when a name is set again.
spec:
  scenario: Storing cookies in a jar
  status: failing
  lines:
    - kw: Given
      text: 'an empty cookie jar'
    - kw: When
      text: 'the cookies "a=1" and "b=2" are stored, then "a=9" is stored'
    - kw: Then
      text: 'the jar holds a=9 and b=2 - setting an existing name replaces its value'
    - kw: And
      text: 'the jar contains two cookies, not three'
code:
  lang: go
  source: |
    // a jar maps cookie name -> value. storing a name that already
    // exists overwrites it (a cookie is identified by its name here).
    type Jar struct { /* map from name to value */ }
    func (j *Jar) SetCookie(c Cookie) { /* jar[c.Name] = c.Value */ }
checkpoint: You have a cookie jar that stores cookies by name and replaces on repeat. Commit and stop here.
---

A **cookie jar** is the client's memory: as responses arrive with `Set-Cookie`, the
jar accumulates them so they can be sent back on future requests. The storage model
is keyed by **name** - setting a cookie whose name already exists **replaces** the old
value, exactly as a real browser updates a session cookie. So storing `a=1`, then
`b=2`, then `a=9` leaves the jar holding `a=9` and `b=2`: two cookies, with `a`
updated in place.

This teaching jar keys purely on the cookie name, which is why setting `a` twice
overwrites. A full implementation keys on name plus domain plus path (so the same
name can exist for different sites), but the name-keyed jar captures the essential
behavior - remember what the server set, update it when told - and is enough to carry
a session. Emitting those cookies back is the next lesson.
