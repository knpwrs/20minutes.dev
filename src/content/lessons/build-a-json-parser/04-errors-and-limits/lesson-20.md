---
project: build-a-json-parser
lesson: 20
title: Malformed objects
overview: Objects have more structure to get wrong than arrays - a key must be a string, a colon must separate key from value, and members are comma-separated. Today you report each of those object failures at its exact position.
goal: Report a non-string key, a missing colon, and a missing comma in an object, each with a position.
spec:
  scenario: Object structure errors
  status: failing
  lines:
    - kw: Given
      text: 'an object with a structural mistake'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse of {1:2} gives "expected string key at line 1, column 2", and Parse of {"a" 1} gives "expected colon after key at line 1, column 6"'
    - kw: And
      text: 'Parse of {"a":1 "b":2} gives "expected comma or closing brace at line 1, column 8", and Parse of {"a":1,} gives "expected string key at line 1, column 8"'
code:
  lang: go
  source: |
    // in the object loop, at each step check the token and message:
    //   key    -> if not a String token: "expected string key"
    //   colon  -> if not ':' : "expected colon after key"
    //   after a value -> expect ',' (continue) or '}' (stop),
    //                    else "expected comma or closing brace"
    // each message points at the offending token's position
checkpoint: Objects report bad keys, missing colons, and missing commas by position. Commit and stop here.
---

An object member has three required parts in order - a **string key**, a **colon**,
and a **value** - and members are joined by commas. Each of those points is a place
the input can be wrong, and a good parser names which one. A non-string key like the
`1` in `{1:2}` is `expected string key`. A key with no colon after it, as in
`{"a" 1}`, is `expected colon after key`, pointing at the token that showed up
instead of the colon. And a member not followed by a comma or a closing brace, like
the second string in `{"a":1 "b":2}`, is `expected comma or closing brace`.

The trailing-comma rule from arrays applies here too, but with the object's own
wording: after a comma the parser expects the next member's key, so `{"a":1,}`
reports `expected string key` at the closing brace. Each check reads the current
token, and when it is not what the grammar demands, produces a `ParseError` carrying
that token's position. Together they turn every structural slip in an object into a
precise, actionable message.
