---
project: build-a-toml-parser
lesson: 15
title: Booleans
overview: 'TOML has a boolean type with exactly two values. Today you parse them, and pin the rule that they are lowercase words only.'
goal: 'Parse the boolean literals true and false, rejecting other spellings.'
spec:
  scenario: Boolean literals
  status: failing
  lines:
    - kw: Given
      text: 'the values true and false'
    - kw: When
      text: 'they are parsed'
    - kw: Then
      text: 'true is the boolean true and false is the boolean false'
    - kw: And
      text: 'booleans are lowercase only, so True and FALSE are not booleans and are an error'
code:
  lang: go
  source: |
    // when the bare token is exactly "true"  -> KindBool, Bool=true
    // when it is exactly "false" -> KindBool, Bool=false
    // "True", "TRUE", "yes", "1" are NOT booleans
    //   (bare words that are not true/false fall through to an error)
checkpoint: 'The two boolean literals parse and nothing else does. Commit and stop here.'
---

TOML's **boolean** type is the simplest value there is: exactly two literals,
`true` and `false`, mapping to a `KindBool` value. When the bare token you read is
one of those two words, you have a boolean.

The rule worth pinning is that booleans are **lowercase always**. Unlike some
config formats that accept `True`, `yes`, `on`, or `1`, TOML recognizes only the
exact lowercase spellings. `True` and `FALSE` are not booleans - they are bare words
that match no value form, so they are an error rather than a quietly-accepted
truthy value. This strictness is deliberate: it keeps documents unambiguous. Testing
both valid literals and a rejected miscased one keeps the boundary honest.
