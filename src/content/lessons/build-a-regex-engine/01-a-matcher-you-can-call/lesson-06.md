---
project: build-a-regex-engine
lesson: 6
title: The star quantifier
overview: '`*` is where regex gets its power - and its first taste of backtracking. It matches the preceding element zero or more times, trying the longest match first and giving characters back when the rest of the pattern needs them.'
goal: Parse `x*` into a Star node that matches the preceding element zero or more times.
spec:
  scenario: Star matches zero or more repetitions
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "ab*c"'
    - kw: When
      text: 'Match is called against "abbbc"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'Match for "ab*c" against "ac" reports true'
    - kw: And
      text: 'Match for "ab*c" against "adc" reports false'
code:
  lang: go
  source: |
    type Star struct{ Sub any } // the element the * applies to

    // A Star has to cooperate with whatever follows it. Think about
    // the two things it can always do at each step: consume one more
    // copy of Sub, or stop and let the rest of the pattern try. It
    // must be willing to take back copies if the rest can't match.
checkpoint: '`*` matches its element zero or more times and backs off when the rest of the pattern needs the characters. Commit and stop here.'
---

`*` attaches to the element right before it (`b*` is "any number of `b`s") and it is
your first **quantifier**. The subtle part is that a quantifier can't be greedy in
isolation: in `ab*c` against `abbbc`, the `b*` would happily eat all three `b`s *and*
the `c`, but then the trailing `c` in the pattern would have nothing to match. So the
star has to be willing to **back off** - match fewer repetitions - until the rest of
the pattern succeeds.

That give-and-take is **backtracking**, the engine of this whole chapter. Notice
that `Star` doesn't need any new matching machinery; it just needs to try its two
options in the right order and defer to `matchHere` for "the rest." Get the ordering
and the hand-off right and the same structure will carry `+` and `?` tomorrow with
almost no new code. (Backtracking is also what will bite us later - hold that
thought for chapter three.)
