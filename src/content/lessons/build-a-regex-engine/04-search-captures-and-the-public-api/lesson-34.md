---
project: build-a-regex-engine
lesson: 34
title: The public API, end to end
overview: The final lesson ties the library together with an ergonomic constructor and a real usage example - compile a date pattern, pull out named fields from a sentence. Your engine is done.
goal: Add MustCompile and demonstrate the whole API on a date-extraction example.
spec:
  scenario: The full API extracts named fields from real text
  status: failing
  lines:
    - kw: Given
      text: 'the compiled pattern "(?P<y>[0-9]{4})-(?P<m>[0-9]{2})-(?P<d>[0-9]{2})"'
    - kw: When
      text: 'FindStringSubmatch runs against "the date 2026-07-08 today"'
    - kw: Then
      text: 'it returns ["2026-07-08", "2026", "07", "08"]'
    - kw: And
      text: MustCompile panics on an invalid pattern but returns a usable Regexp on a valid one
    - kw: And
      text: a runnable usage example compiles a pattern and prints its named submatches
code:
  lang: go
  source: |
    // MustCompile: the ergonomic constructor for known-good patterns.
    func MustCompile(pat string) *Regexp {
        re, err := Compile(pat)
        if err != nil { panic(err) }
        return re
    }
    // Write an Example test that compiles the date regex, runs
    // FindStringSubmatch on a sentence, and prints the year/month/lesson.
checkpoint: MustCompile and a working example round out the public API. Your regex engine is complete - commit and stop.
---

The last lesson is about ergonomics and proof. `MustCompile` is the constructor you reach
for with a literal, known-good pattern: it compiles and panics on error, so package-level
regexes can be declared in one line. Everything else already exists - `Compile`,
`MatchString`, `Find`, `FindStringSubmatch`, `SubexpNames`, `FindAllString`,
`ReplaceAllString`. The job now is to make them read as one coherent surface, the way
Go's `regexp` does.

The date example is the whole project in miniature: `[0-9]{4}` leans on counted
repetition and classes from chapter two, `FindStringSubmatch` on the captures from this
chapter, and named groups make the result self-describing - pull `y`, `m`, `d` straight
out of a sentence. Thirty-four lessons ago you had a function that compared two strings.
Now you have a small, honest regex library. It stops short of lookaround, backreferences,
and full Unicode - the features a production engine layers on top - but the core you
built is exactly the core those engines share.
