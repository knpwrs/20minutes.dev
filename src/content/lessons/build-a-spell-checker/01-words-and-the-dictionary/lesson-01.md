---
project: build-a-spell-checker
lesson: 1
title: An empty dictionary that answers "unknown"
overview: Every spell checker starts with one question - is this word real? Today you build the smallest possible dictionary, one that knows no words yet, so the public surface exists from day one and every later lesson thickens it.
goal: Create an empty dictionary whose membership check reports that any word is unknown.
spec:
  scenario: Checking a word against an empty dictionary
  status: failing
  lines:
    - kw: Given
      text: a brand-new, empty dictionary
    - kw: When
      text: 'Contains is called with the word "apple"'
    - kw: Then
      text: it reports false (the word is not known)
code:
  lang: go
  source: |
    // the whole checker will grow around this type
    type Dictionary struct { /* word storage comes next lesson */ }
    func New() *Dictionary { return &Dictionary{} }
    // "known" vs "unknown" is the one question a spell checker answers
    func (d *Dictionary) Contains(word string) bool {
      return false
    }
checkpoint: You have an importable dictionary with a Contains that cleanly reports "unknown". Commit and stop here.
---

A spell checker is, at heart, a thing that answers one question over and over:
**is this a real word?** Everything else - measuring typos, suggesting fixes -
hangs off that single membership test. So before any of the clever machinery
matters, the shape of that surface has to exist: something you can construct and
ask about a word. Today it knows nothing, so every word is unknown.

Starting from an empty dictionary that always answers **false** may feel trivial,
but it pins the contract the rest of the project leans on. `Contains` takes a word
and returns a plain yes or no. Keep it that simple - the storage, the
case-folding, the loading all arrive one lesson at a time on top of this.
