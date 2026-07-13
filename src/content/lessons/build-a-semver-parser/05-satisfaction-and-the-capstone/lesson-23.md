---
project: build-a-semver-parser
lesson: 23
title: Printing a range back
overview: A parsed range should be able to show the plain comparators it expands into, which makes every bit of sugar you built inspectable. Today you write Range's String method and pin the exact desugaring of each form.
goal: Render a Range as its normalized comparator sets, joined by spaces and "||".
spec:
  scenario: A range prints as the comparators it desugars to
  status: failing
  lines:
    - kw: Given
      text: 'ranges parsed with ParseRange'
    - kw: When
      text: 'each range String method is called'
    - kw: Then
      text: 'ParseRange("^1.2.3").String() is ">=1.2.3 <2.0.0", ParseRange("~1.2.3").String() is ">=1.2.3 <1.3.0", ParseRange("^0.0.3").String() is ">=0.0.3 <0.0.4", and ParseRange("1.x").String() is ">=1.0.0 <2.0.0"'
    - kw: And
      text: 'ParseRange("1.2.3 - 2.3.4").String() is ">=1.2.3 <=2.3.4", ParseRange("1.2.3 || >=2.0.0").String() is "=1.2.3 || >=2.0.0", and ParseRange("*").String() is ">=0.0.0"'
code:
  lang: go
  source: |
    // A comparator prints as Op + version. A set joins its comparators with a space.
    // The range joins its sets with " || ".
    func (c Comparator) String() string { return c.Op + c.V.String() }
    func (r Range) String() string { /* join each set's comparators, then join sets with " || " */ }
checkpoint: A range can print the normalized comparators it stands for. Commit and stop here.
---

Every sugar form you built - hyphen, tilde, caret, x-range - lowers to plain
comparators, but so far that expansion has been invisible: you could only observe
it indirectly through `Satisfies`. Giving `Range` a `String` method makes the
**normalized** form explicit. A comparator prints as its operator plus its version
(reusing the `Version.String` from the parsing chapter), a set joins its
comparators with a space, and the whole range joins its sets with `||`. So
`^1.2.3` prints back as `>=1.2.3 <2.0.0` - the exact bounds it desugared to.

This is the range analog of the version round-trip in lesson 6, and it is worth
having for its own sake: it turns the desugaring rules into checkable strings, so
`~1.2.3` is visibly `>=1.2.3 <1.3.0`, `^0.0.3` is visibly `>=0.0.3 <0.0.4`, and a
bare `1.2.3` shows its implicit `=1.2.3`. It is also the display layer a command
line tool leans on to explain what a range actually means. Note it prints the
*normalized* comparators, not the original text - `1.x` comes back as
`>=1.0.0 <2.0.0` - which is exactly what makes it useful for seeing through the
sugar.
