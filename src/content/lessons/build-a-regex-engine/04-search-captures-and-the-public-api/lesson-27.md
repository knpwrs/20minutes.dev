---
project: build-a-regex-engine
lesson: 27
title: Compile and error handling
overview: A real regex library compiles a pattern once into a reusable object and reports bad patterns instead of crashing. Today you introduce the Regexp type and turn parse failures into errors.
goal: Add Compile, returning a reusable Regexp for a valid pattern or an error for an invalid one.
spec:
  scenario: Compile validates a pattern and returns a reusable object
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "(" with an unbalanced parenthesis'
    - kw: When
      text: Compile is called on it
    - kw: Then
      text: it returns a non-nil error
    - kw: And
      text: 'Compile on "ab" returns a Regexp and no error'
    - kw: And
      text: 'that Regexp matches "zabz" (contains "ab")'
code:
  lang: go
  source: |
    type Regexp struct{ /* parsed AST, compiled NFA, group info */ }

    func Compile(pat string) (*Regexp, error) {
        // parser now RETURNS an error instead of assuming valid input:
        // an unbalanced ( or [, or a trailing backslash.
    }
    func (re *Regexp) MatchString(s string) bool { /* reuse Match */ }
checkpoint: Compile returns a reusable Regexp or a clear error, and MatchString runs it. Commit and stop here.
---

Until now every call re-parsed the pattern, and a malformed pattern like `(` would
misbehave silently or panic. A library needs to do better on both counts. `Compile`
parses the pattern **once** into a `Regexp` value you can reuse across many matches,
and it returns an `error` when the pattern is invalid - an unbalanced `(` or `[`, or a
dangling backslash. This is the entry point real callers use, and it mirrors how Go's
own `regexp.Compile` works. (You can tighten up other cases, like a malformed `{n,m}`,
on a later lesson - keep today to the two or three unmistakable errors.)

The work is mostly in the parser: instead of assuming well-formed input, each place
that expects a closing `)` or `]` now reports an error if it hits the end of the
pattern first. Thread those errors up and out of `Compile`. Your existing `Match`
becomes a thin convenience wrapper - compile, then match - while `Regexp.MatchString`
runs an already-compiled pattern. With a stable compiled object in hand, the rest of
the chapter hangs richer queries off it: where a match is, and what its groups
captured.
