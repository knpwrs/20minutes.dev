---
project: build-a-glob-matcher
lesson: 4
title: The two-pointer linear scan
overview: 'The backtracking star is correct but can be exponentially slow. Today you rewrite Match as a single forward scan that remembers the last star and backtracks only there - identical results, but linear time, and a matchOne helper that every later token will plug into.'
goal: 'Rewrite Match as a two-pointer scan that runs in time proportional to the pattern times the name.'
spec:
  scenario: The linear matcher agrees with backtracking and does not blow up
  status: failing
  lines:
    - kw: Given
      text: 'the same wildcard behaviour, now driven by a forward scan'
    - kw: When
      text: 'Match is rebuilt with two pointers plus a remembered star position'
    - kw: Then
      text: 'every earlier result is unchanged - Match("*.txt", "a.txt") is true, Match("a*", "a") is true - and Match("a*a*b", "axxab") is true'
    - kw: And
      text: 'Match("a*a*a*a*a*a*b", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") is false and returns immediately, because the scan is O(pattern times name), not exponential'
code:
  lang: go
  source: |
    // one token at a time: literal or ?, returns the next pattern index
    func matchOne(pat string, p int, c byte) (bool, int) {
      if p >= len(pat) { return false, p }
      if pat[p] == '?' { return true, p + 1 }
      return pat[p] == c, p + 1
    }
    // in Match: when stuck, jump back to just after the last star and let it eat one more
    star, ss := -1, 0
    // on '*': star, ss = p, s; p++
    // else if it matches: advance both; else if star!=-1: p=star+1; ss++; s=ss; else false
checkpoint: 'Match runs as a linear two-pointer scan with a matchOne helper. Commit and stop here.'
---

The backtracking matcher has a trap: a pattern like `a*a*a*...*b` against a long
run of the wrong characters makes it try an exponential number of ways to divide
the name among the stars. The fix, described by Russ Cox, is to notice you never
need more than **one** live star at a time. Scan forward with two indices - one in
the pattern, one in the name. On a `*`, **remember** its position and where you are
in the name, then move past it. When a later character fails to match, don't
recurse: **jump back** to just after the remembered star, advance the name by one,
and try again. Each failure only ever nudges the star forward, so the whole thing
runs in time proportional to the pattern length times the name length.

The behaviour is identical to lesson 3 - the same booleans come out - but the
adversarial pattern now returns at once instead of hanging. The other reason to do
this today is `matchOne`: pulling "does the token at position `p` match this
character, and how many pattern characters did it span" into its own helper is what
lets character classes, escapes, and the rest each become a small addition to one
function instead of a rewrite of the loop.
