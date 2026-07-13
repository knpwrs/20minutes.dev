---
project: build-an-lsm-storage-engine
lesson: 14
title: Point lookup in an SSTable
overview: Range walks are one half of reads; single-key lookups are the other. Today you add Get to an SSTable - find one key's value in the file - starting with the simplest version that scans records until it finds it.
goal: Look up a single key in an SSTable, returning its value or a clear not-found.
spec:
  scenario: Finding (and missing) a key in an SSTable
  status: failing
  lines:
    - kw: Given
      text: 'an SSTable with records ("apple","red"), ("banana","yellow"), ("cherry","dark")'
    - kw: When
      text: 'Get("banana") is called on it'
    - kw: Then
      text: 'it returns "yellow" with a found flag'
    - kw: And
      text: 'Get("date") returns not-found, and because records are sorted the scan can stop once it passes where "date" would be'
code:
  lang: go
  source: |
    func (s *SSTable) Get(key string) ([]byte, bool) {
      // walk records in order; return on exact match.
      // since keys are sorted, once a record's key > target you
      // can stop early - the key isn't here.
    }
checkpoint: An SSTable answers single-key lookups with an early stop on miss. Commit and stop here.
---

A **point lookup** finds one key. Today's version is the honest baseline: walk the
records and return the value when the key matches. Because the file is **sorted**,
a miss doesn't require reading to the end - the moment you pass a record whose key
is greater than the target, you know the target isn't present and can stop.

This linear scan is correct but reads far more of the file than it should for a
big table. That is precisely the problem the next two lessons solve with an
**index**: instead of scanning from the top every time, you will jump close to the
key first. Getting the correct-but-slow version working now means the index is a
pure speedup you can verify against this behavior, not a behavior change.
