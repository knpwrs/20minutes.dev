---
title: 'Build a Semantic Version Parser and Range Matcher'
order: 52
lessons: 24
size: 'Small'
tech: ['Semantic versioning', 'Version ranges', 'Precedence rules']
estMin: 20
desc: 'Build the library behind every package manager: a parser and range matcher for Semantic Versioning 2.0.0. Parse a version string into its major, minor, patch, prerelease, and build parts and reject malformed ones; order any two versions by the exact SemVer precedence rules, including the tricky prerelease chain; parse npm-style ranges (comparators, hyphen, tilde, caret, and x-ranges combined with AND and OR); and answer the two questions a resolver actually asks - does this version satisfy this range, and which installed version is the best match.'
blurb: 'Every dependency you install runs through code like this. Each lesson is one concrete spec with exact values pinned to the SemVer 2.0.0 spec and the node-semver range grammar: parse 1.2.3-beta.1+build.5 into its parts, reject a leading zero, order the full prerelease chain from 1.0.0-alpha up to 1.0.0, desugar ~1.2.3 and ^0.2.3 and 1.x into comparator pairs, and select the max-satisfying version from a list. No pointers, no I/O, no dependencies - just a version string in and a precise answer out.'
overview: |
  Over 24 lessons you build a complete Semantic Versioning toolkit - the same job that npm, Cargo, and Go modules do every time you install a package - as a small, dependency-free library. It parses a version string into its parts, orders any two versions by precedence, parses a range expression, and tells you whether a version satisfies a range and which version from a list is the best match. Every lesson is one concrete spec with exact values anchored to the SemVer 2.0.0 specification and the node-semver range grammar, so the library you write behaves identically in any language.

  You start by parsing a version - the numeric core, the optional prerelease, and the build metadata - and rejecting the malformed ones (a leading zero, a missing part, a bad identifier). Then you build precedence: comparing the numeric core, ranking a prerelease below its release, and walking prerelease identifiers left to right to reproduce the exact chain the spec spells out, ending in a sort. From there you parse ranges - comparators, comparator sets combined with AND, alternatives joined by OR, and the sugar that expands into them: hyphen ranges, tilde, caret with its zero-component special cases, and x-ranges. The capstone answers a resolver's real questions: does a version satisfy a range, and what is the max-satisfying pick from a list.

  This is a teaching-grade but genuinely faithful implementation of SemVer 2.0.0 precedence and the common npm range operators in their full MAJOR.MINOR.PATCH spellings. It is a library you import, not a program you run against a registry: there is no network, no lockfile, and no dependency-graph resolution - it answers one version-versus-range question at a time, which is exactly the primitive those larger systems are built on.
parts:
  - name: 'Parsing a version'
    count: 6
  - name: 'Version precedence'
    count: 6
  - name: 'Ranges and comparators'
    count: 4
  - name: 'Tilde, caret, and x-ranges'
    count: 4
  - name: 'Satisfaction and the capstone'
    count: 4
caveats:
  note: 'The core parser, precedence engine, and range matcher are complete and faithful to SemVer 2.0.0 and the common node-semver operators (comparators, hyphen, tilde, caret including the 0.x cases, x-ranges, AND/OR, the prerelease-satisfaction rule, and max-satisfying selection), but it targets the full MAJOR.MINOR.PATCH spellings: partial tilde/caret forms (~1.2, ^1), the != operator, x in comparator position, and a leading v prefix are unsupported, and ParseRange silently drops an unparseable token rather than erroring (the finalize CLI validates instead).'
  future:
    - 'Add a ParseRangeStrict that returns an error from the library itself instead of leaving validation to the CLI, so an unparseable token is rejected rather than silently dropped'
    - 'Support the partial tilde and caret forms node-semver accepts - ~1.2, ~1, ^1.2, ^1 - which widen the bound to the missing component'
    - 'Add the != operator and allow x, X, or * in comparator position (>=1.x), completing the comparator grammar'
    - 'Accept and normalize a leading v prefix (v1.2.3) the way Go modules and many tags write versions'
    - 'Build the layer above a single range: resolving a whole dependency graph, reading a lockfile, or diffing two version sets'
    - 'Add a coerce mode that repairs loose inputs (1.2 to 1.2.0, trailing junk trimmed) for the real-world strings registries actually contain'
resources:
  - title: 'Semantic Versioning 2.0.0'
    author: 'Tom Preston-Werner'
    url: 'https://semver.org/'
    note: 'The specification this whole project implements. Eleven numbered clauses define the version grammar, the leading-zero and identifier rules, and - in clause 11 - the exact precedence algorithm and the worked prerelease chain the precedence chapter reproduces value for value.'
  - title: 'node-semver'
    url: 'https://github.com/npm/node-semver'
    note: 'The reference implementation of npm ranges. Its README is the grammar for comparators, hyphen ranges, tilde, caret (including the 0.x and 0.0.x special cases), x-ranges, and the prerelease-satisfaction rule that the ranges and satisfaction chapters follow.'
  - title: 'About semantic versioning'
    url: 'https://docs.npmjs.com/about-semantic-versioning'
    note: 'The npm docs orientation on how versions and ranges are used in practice - why caret and tilde exist and what a range like ^1.0.4 actually admits. The gentle companion to the node-semver grammar.'
  - title: 'Go Modules Reference: Versions'
    url: 'https://go.dev/ref/mod#versions'
    note: 'How Go modules define and compare semantic versions, including its stricter take on prerelease and build metadata. A useful second data point on precedence and how a real tool applies it.'
  - title: 'The Cargo Book: Specifying Dependencies'
    url: 'https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html'
    note: 'Cargo default-caret requirements and comparison operators, a slightly different range dialect built on the same version precedence - good for seeing which choices in this project are SemVer core versus one ecosystem convention.'
---
