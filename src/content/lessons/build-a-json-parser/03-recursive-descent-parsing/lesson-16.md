---
project: build-a-json-parser
lesson: 16
title: Duplicate keys resolve last-wins
overview: JSON does not forbid a repeated key, so a parser must decide what to do with one. Today you make the deliberate choice - last value wins, keeping the key's original position - and pin it with a test.
goal: Resolve a repeated object key so the last value wins while member order is preserved.
spec:
  scenario: The same key appearing twice
  status: failing
  lines:
    - kw: Given
      text: 'an object literal with a repeated key'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse of {"a":1,"a":2} is an Object with exactly one member, key a with Number 2'
    - kw: And
      text: 'Parse of {"a":1,"b":2,"a":3} has two members in order a with Number 3 then b with Number 2'
code:
  lang: go
  source: |
    // when appending a member, first look for an existing member with
    // the same key:
    //   found  -> overwrite its Value in place (position unchanged)
    //   absent -> append a new member
    // this yields last-wins while keeping first-seen order
checkpoint: Repeated keys resolve last-wins with stable order. Commit and stop here.
---

The JSON grammar happily allows `{"a":1,"a":2}`, but the data model says an object's
names should be unique, so a parser has to pick a policy. RFC 8259 leaves it to the
implementation; the common, predictable choice - the one JavaScript's own parser
makes - is **last-wins**: a later value for a key replaces the earlier one. This
library commits to that, explicitly, so the behavior is defined rather than
accidental.

Implement it by checking for an existing member with the same key before appending:
if one is there, overwrite its value **in place** so the key keeps its original
position; otherwise append a new member. That gives `{"a":1,"a":2}` a single member
`a` holding `2`, and `{"a":1,"b":2,"a":3}` the members `a` (now `3`) then `b`, in
first-seen order. Pinning this with a test turns an easy-to-miss ambiguity into a
guarantee.
