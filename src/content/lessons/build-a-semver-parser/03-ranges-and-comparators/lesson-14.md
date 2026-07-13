---
project: build-a-semver-parser
lesson: 14
title: A comparator set and satisfaction
overview: Space-separated comparators form an AND set - a version must satisfy every one. Today you introduce the Range value and the Satisfies function that the rest of the library is built to answer.
goal: Parse space-separated comparators into a set and satisfy it only when every comparator matches.
spec:
  scenario: A version satisfies a set only if it matches every comparator
  status: failing
  lines:
    - kw: Given
      text: 'the range ">=1.2.3 <1.3.0" parsed with ParseRange'
    - kw: When
      text: 'versions are tested with Satisfies'
    - kw: Then
      text: '1.2.3 and 1.2.9 satisfy it, while 1.3.0 and 1.0.0 do not'
    - kw: And
      text: 'the empty range "" is satisfied by every version'
code:
  lang: go
  source: |
    // Front-load the final shape: a Range is an OR of AND-sets. One set for now.
    type Range [][]Comparator
    func ParseRange(s string) Range {
      // split on spaces into comparators; that list is a single AND-set.
      // wrap it as Range{ set } so the OR layer can be added later without reshaping.
    }
    // Satisfies: the version must match EVERY comparator in the set.
    func Satisfies(v Version, r Range) bool { /* ... */ }
checkpoint: You can test a version against an AND-set of comparators. Commit and stop here.
---

Real ranges bound versions from both sides: `>=1.2.3 <1.3.0` means "at least
`1.2.3` **and** below `1.3.0`." Space-separated comparators form a **comparator
set**, joined by AND - a version satisfies the set only if it matches *every*
comparator in it. That is the definition of `Satisfies`, the function this whole
library exists to answer, so introduce it now along with the `Range` value it
operates on.

Give `Range` its final shape today even though you only need part of it: a range
is an **OR of AND-sets**, `[][]Comparator`. Right now `ParseRange` produces a
single set, wrapped as a one-element outer list, but next lesson the `||` operator
adds more sets to that outer list without you having to reshape anything -
`Satisfies` will just check whether *any* set is satisfied. Front-loading the
two-level structure is the same move as giving `Version` all its fields on day
one. One natural edge: an empty range string parses to an empty set, and a version
vacuously matches "every comparator" of an empty set, so `""` is satisfied by
everything.
