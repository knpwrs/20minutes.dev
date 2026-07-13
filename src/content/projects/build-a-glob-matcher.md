---
title: 'Build a Glob and Gitignore Matcher'
order: 50
lessons: 22
size: 'Small'
tech: ['Glob matching', 'Wildcards', 'Gitignore']
estMin: 20
desc: 'Match paths with globs and gitignore rules: wildcards, character classes, and globstar.'
blurb: 'A glob is just a pattern language, and gitignore is a thin, precise layer of rules on top of one. Build both from scratch: every lesson is one concrete spec with exact match booleans - the star matches a run of characters but a question mark matches exactly one, a range and a negated class pick and reject the right characters, an unclosed bracket falls back to a literal, the star stops at a slash while the double-star crosses it, an anchored rule pins to the base while a floating one matches at any depth, a trailing slash matches directories only, and a leading bang re-includes a path an earlier rule ignored.'
overview: |
  Over 22 lessons you build a glob and gitignore matcher from first principles, as a small importable library rather than a program you run. Its two public entry points are the product: one function answers "does this glob pattern match this path", and a compiled rule-set answers "does this .gitignore ignore this path". Because every answer is an exact boolean, the whole thing stays precisely testable and reads the same in any language.

  You begin with the core single-segment matcher: a literal name, the single-character wildcard, and the star. You write the star two ways - first the natural recursive backtracker (correct, but exponential on a crafted pattern), then the classic two-pointer linear scan that remembers the last star and runs in time proportional to the pattern times the path. From there you add character classes with ranges and negation, the unclosed-bracket and literal-bracket edge cases, and backslash escaping. Then the matcher becomes path-aware: it splits on the slash so the star and question mark never cross a directory boundary, while a double-star segment spans any number of directories.

  On that foundation you build the real payoff, a gitignore engine: parse a file into rules (skipping blanks and comments, stripping trailing spaces), match floating patterns at any depth and anchored patterns from the base, honour directory-only rules, apply negation that re-includes a previously ignored path, and resolve conflicts by last-match-wins. The project ends with two capstones that assert the exact match set for a glob and the exact ignore-or-keep verdict for every path against a realistic .gitignore. This is a teaching-grade matcher built around the POSIX and git rules; the finalize pass adds a small command-line demo and documents where it simplifies real git (no ancestor .gitignore chaining, no case-insensitive mode).
parts:
  - name: 'The core matcher'
    count: 4
  - name: 'Character classes and escaping'
    count: 6
  - name: 'Paths and globstar'
    count: 2
  - name: 'The gitignore engine'
    count: 8
  - name: 'Capstones'
    count: 2
caveats:
  note: 'A genuinely working matcher: the full glob feature set (literal, question mark, star with a linear two-pointer scan, character classes with ranges and negation, the literal-bracket and unclosed-bracket edges, backslash escaping, path segments, and the double-star globstar) plus a real single-rule-set gitignore engine (comments, trailing-space and escaped-marker parsing, floating and anchored patterns, directory-only rules, negation, last-match-wins precedence, and ancestor-directory exclusion), driven by a small CLI demo - but it works over a single rule-set and skips multi-directory .gitignore chaining, case-insensitivity, and POSIX class names.'
  future:
    - 'Ancestor .gitignore chaining and stacking, so nested directories each contribute rules the way git actually resolves them'
    - 'POSIX character-class names like [:alpha:] and [:digit:] inside a bracket expression'
    - 'A case-insensitive matching mode, mirroring git''s core.ignorecase'
    - 'Layer .git/info/exclude and a global excludes file on top of the per-directory rules'
    - 'Brace expansion ({a,b,c}) in glob patterns'
    - 'A directory-walk Filter that skips whole ignored subtrees instead of filtering a path list after the fact'
resources:
  - title: 'POSIX Pattern Matching Notation (The Open Group Base Specifications)'
    url: 'https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_13'
    note: 'The authoritative definition of the glob pattern language the shell uses: the question mark, the star, and the bracket expression with ranges, negation, and the literal-bracket rule. The whole of Chapters 1 to 3 is an implementation of this section.'
  - title: 'fnmatch() (The Open Group Base Specifications)'
    url: 'https://pubs.opengroup.org/onlinepubs/9699919799/functions/fnmatch.html'
    note: 'The C library function that matches a filename against a pattern, including the FNM_PATHNAME flag that makes the star stop at a slash - exactly the path-aware behaviour built in the paths chapter.'
  - title: 'gitignore (git-scm documentation)'
    url: 'https://git-scm.com/docs/gitignore'
    note: 'The precise rules the gitignore chapter implements: blank lines and comments, the trailing-slash directory rule, the leading-slash anchor, a double-star that spans directories, negation with a leading bang, and last-match-wins precedence. Read the PATTERN FORMAT section alongside those lessons.'
  - title: 'Glob Matching Can Be Simple And Fast Too'
    author: 'Russ Cox'
    url: 'https://research.swtch.com/glob'
    note: 'Why the natural recursive star matcher is exponential on a pattern like a*a*a*...*b, and how the two-pointer linear scan - remember the last star position and backtrack only there - fixes it. The direct source for the two lessons on the linear matcher.'
  - title: 'Pattern Matching (Bash Reference Manual)'
    author: 'Free Software Foundation'
    url: 'https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html'
    note: 'The shell view of the same pattern language, including the globstar option where a double-star matches across directory boundaries - useful background for the paths-and-globstar chapter.'
---
