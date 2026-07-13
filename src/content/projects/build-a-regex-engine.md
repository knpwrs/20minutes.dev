---
title: 'Build a Regex Engine'
order: 8
lessons: 34
size: 'Small'
tech: ['NFA', 'Backtracking']
estMin: 20
desc: 'Grow a regex library from a thirty-line matcher into a Thompson NFA that matches in linear time.'
blurb: 'Regex is a tiny language with a beautiful implementation. You start with a matcher you can call on lesson one, then parse patterns into a tree, add the syntax real engines have, and build an NFA that never blows up - each step pinned by a concrete spec.'
overview: |
  Over the next 34 lessons you'll build a regular-expression engine in the language of
  your choice, starting from a thirty-line matcher you can call on lesson one and
  growing it into a small library that mirrors a real `regexp` package. You'll parse
  patterns into a syntax tree; add groups, alternation, character classes, escapes,
  and `{n,m}` counts; then build a Thompson NFA that matches in linear time without
  the catastrophic backtracking that hangs naive engines.

  By the end you'll have a teaching-grade regex library: compile a pattern once, then
  search text, pull out numbered and named capture groups, find every match, and
  replace. It deliberately stops short of lookaround, backreferences, and full
  Unicode - the features a production engine layers on top of exactly this core.
parts:
  - name: 'A matcher you can call'
    count: 8
  - name: 'Groups, classes & repetition'
    count: 9
  - name: 'The Thompson NFA'
    count: 9
  - name: 'Search, captures & the public API'
    count: 8
caveats:
  note: 'A solid teaching-grade ASCII regex library with two working engines and coherent capture semantics - not production-ready: no Unicode, no lookaround or backreferences, and capture correctness still degrades on deeply nested quantified constructs.'
  future:
    - 'Group support in the Thompson NFA, so the linear-time engine also matches parenthesized patterns'
    - 'A Pike VM for linear-time matching with full, unrestricted capture groups (no backtracking blow-up)'
    - 'UTF-8 / Unicode-aware `.` and character classes (`\p{L}`, and friends)'
    - 'Lookaround (`(?=...)`, `(?!...)`) and backreferences (`\1`, `\k<name>`)'
    - 'POSIX leftmost-longest matching and non-greedy quantifiers (`*?`, `+?`, `??`)'
resources:
  - title: 'Regular Expression Matching Can Be Simple And Fast'
    author: 'Russ Cox'
    url: 'https://swtch.com/~rsc/regexp/regexp1.html'
    note: 'The essay that explains why backtracking blows up and how Thompson NFA simulation stays linear - the heart of this project''s third chapter.'
  - title: 'Regular Expression Matching: the Virtual Machine Approach'
    author: 'Russ Cox'
    url: 'https://swtch.com/~rsc/regexp/regexp2.html'
    note: 'Companion piece extending the NFA into a bytecode VM with capture support - where to go after you finish.'
  - title: 'Beautiful Code, Chapter 1: A Regular Expression Matcher'
    author: 'Brian Kernighan'
    note: 'The thirty-line backtracking matcher this project opens with, explained by its author.'
  - title: 'Mastering Regular Expressions'
    author: 'Jeffrey E. F. Friedl'
    url: 'https://regex.info/book.html'
    note: 'The definitive guide to regex semantics and how engines actually behave across languages.'
  - title: 'Compilers: Principles, Techniques, and Tools'
    author: 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman'
    note: 'The "Dragon Book," with the formal treatment of Thompson construction and NFA simulation behind chapter three.'
---
