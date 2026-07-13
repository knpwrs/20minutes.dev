---
title: 'Build a Fuzzy Finder'
order: 12
lessons: 34
size: 'Small'
tech: ['Subsequence matching', 'Dynamic programming', 'Ranking']
estMin: 20
desc: 'Filter and rank a list as you type, fzf-style: subsequence matching with a smart scoring model.'
blurb: 'Start with a one-line subsequence test and end with a real fuzzy finder that filters a corpus, ranks matches like fzf, highlights where each query character landed, and narrows interactively as you type. Every lesson gives you a concrete spec with exact scores and positions to hit, and the finder grows one honest piece at a time - matching, scoring, an optimal alignment, ranking, and an interactive loop.'
overview: |
  Over 34 lessons you build a working fuzzy finder in the spirit of fzf. You begin with the core question - does a query fuzzy-match a candidate, character by character, in order - and grow it into a scoring model that rewards consecutive matches, matches at word and path boundaries, and camelCase humps, while penalizing gaps and a slow start. A dynamic-programming pass then finds the highest-scoring alignment (not just any match) and traces back the exact positions, which drive highlighting. From there you rank a whole candidate list, add fzf-style extended query syntax (exact, anchored, and negated terms), and wrap it all in an interactive finder that narrows as you type.

  By the end you have a runnable tool: a non-interactive filter mode (pipe a list in, get the ranked, highlighted matches out) and an interactive finder model - query state, selection movement, keystroke handling, and a rendered frame - driven over a real corpus such as a file listing. The capstone runs a scripted interactive session over a file tree and proves the ranked frames and the accepted path are exactly what the design predicts.

  This is a teaching-grade finder built around fzf's real algorithm: correct, ranked, and genuinely usable, but it stops short of what fzf ships on top - a full-screen ANSI-themed terminal UI with a preview window, multi-select, Unicode normalization, asynchronous loading of a still-streaming corpus, and every nuance of fzf's tuned scoring. What you finish with is the honest core all of those are built around.
parts:
  - name: 'Matching'
    count: 6
  - name: 'Scoring a match'
    count: 7
  - name: 'Ranking and query syntax'
    count: 8
  - name: 'The interactive finder'
    count: 8
  - name: 'A real fuzzy finder'
    count: 5
caveats:
  note: 'A complete, usable fuzzy-finder engine - smart-case subsequence matching, the boundary- and camelCase-aware dynamic-programming scorer, ranking with tie-breaks, and fzf-style extended query syntax - shared across a non-interactive filter mode, a real interactive terminal finder, and a zero-setup demo; the interactive terminal loop is deliberately minimal (ASCII keys, no resize handling) rather than a full-screen fzf clone.'
  future:
    - 'Wire the bounded top-K fast path into the live keystroke loop so a very large corpus stays responsive as you type'
    - 'Reassemble UTF-8 runes in the key decoder so non-ASCII candidates and queries work in interactive mode'
    - 'React to terminal resize (SIGWINCH) to reflow the visible row count mid-session'
    - 'Give cancel (Esc / Ctrl-C) a distinct non-zero exit code, the way fzf returns 130'
    - 'Add multi-select (Tab to mark several candidates and accept the set), fzf''s -m flag'
    - 'Add a preview window and ANSI color themes for the selected candidate'
resources:
  - title: 'fzf'
    author: 'Junegunn Choi'
    url: 'https://github.com/junegunn/fzf'
    note: 'The command-line fuzzy finder this project is modeled on. Its src/algo package documents the exact boundary- and gap-aware scoring you build here.'
  - title: "Reverse Engineering Sublime Text's Fuzzy Match"
    author: 'Forrest Smith'
    url: 'https://www.forrestthewoods.com/blog/reverse_engineering_sublime_texts_fuzzy_match/'
    note: 'The clearest walk-through of a practical fuzzy-match scorer - consecutive, boundary, and camelCase bonuses plus gap penalties - the model this project uses.'
  - title: 'Smith-Waterman algorithm'
    url: 'https://en.wikipedia.org/wiki/Smith%E2%80%93Waterman_algorithm'
    note: 'The local sequence-alignment dynamic program that the best-match pass is a scoring variant of - fill a table, then trace back the optimal path.'
  - title: 'selecta'
    author: 'Gary Bernhardt'
    url: 'https://github.com/garybernhardt/selecta'
    note: 'A small, readable fuzzy selector whose README explains, from first principles, why a good finder ranks by match quality rather than just filtering.'
  - title: 'skim'
    author: 'Jinzhou Zhang'
    url: 'https://github.com/skim-rs/skim'
    note: 'A fuzzy finder that reimplements the fzf model in another language - a useful second reference for the scoring and ranking design.'
---
