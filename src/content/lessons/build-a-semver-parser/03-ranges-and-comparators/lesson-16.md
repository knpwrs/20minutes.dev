---
project: build-a-semver-parser
lesson: 16
title: Hyphen ranges
overview: A hyphen range like "1.2.3 - 2.3.4" is a readable way to write an inclusive span. Today you desugar it into the two comparators it stands for - the first sugar of several to come.
goal: Expand a hyphen range into a ">=" lower bound and a "<=" upper bound.
spec:
  scenario: A hyphen range is an inclusive span
  status: failing
  lines:
    - kw: Given
      text: 'the range "1.2.3 - 2.3.4" parsed with ParseRange'
    - kw: When
      text: 'versions are tested'
    - kw: Then
      text: '1.2.3, 2.0.0 and 2.3.4 satisfy it, since it means the set ">=1.2.3 <=2.3.4"'
    - kw: And
      text: '1.2.2 and 2.3.5 do not satisfy it, because both ends are inclusive'
code:
  lang: go
  source: |
    // Detect a hyphen range: a set whose tokens are "<lo> - <hi>" (a bare "-" surrounded by spaces).
    // Expand it to two comparators BEFORE the ordinary space-splitting:
    //   "1.2.3 - 2.3.4"  ->  [ >=1.2.3 , <=2.3.4 ]
    // Note the upper bound uses "<=", not "<": the high end is INCLUSIVE.
checkpoint: Hyphen ranges expand into an inclusive comparator pair. Commit and stop here.
---

npm ranges come with **sugar** - compact spellings that expand into plain
comparators - and the simplest is the **hyphen range**. `1.2.3 - 2.3.4` means the
inclusive span from `1.2.3` up to and including `2.3.4`, which is just the
comparator set `>=1.2.3 <=2.3.4`. The detail to get right is that **both ends are
inclusive**: the upper bound is `<=`, not `<`, so `2.3.4` itself satisfies the
range and `2.3.5` does not.

Desugaring is the pattern for the rest of this chapter and the next: recognize the
special form and rewrite it as ordinary comparators, so `Satisfies` never has to
learn anything new. A hyphen range is a set whose three tokens are a low version,
a lone `-`, and a high version; spot that shape while parsing a set and emit the
two bounds. Because it lowers to plain comparators, everything downstream - AND,
OR, satisfaction - keeps working unchanged. The next lessons add tilde, caret, and
x-ranges the same way, each one just another rewrite into comparators.
