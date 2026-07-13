---
title: 'Build a Diff Tool'
order: 35
lessons: 28
size: 'Small'
tech: ['Myers diff', 'Longest common subsequence', 'Unified diff']
desc: 'Build a real diff with the Myers algorithm: shortest edit scripts and unified-diff output.'
blurb: 'Diff two sequences of lines as finding the shortest edit script of inserts and deletes - equivalently the longest common subsequence - and pin every value exactly: the LCS length, the Myers edit distance D (5 for ABCABBA vs CBABAC), the V array evolution, the recovered keep/insert/delete script, the @@ -1,5 +1,5 @@ hunk header, and the round-trip where applying your own diff reproduces the target byte for byte. Every lesson is one concrete spec: an exact edit script, an exact D, or an exact block of unified-diff text.'
overview: |
  Over 28 lessons you build a working line-based diff library from scratch - the core of what git diff, patch, and code review tools do every day. You model diffing two documents as finding a shortest edit script of insertions and deletions, which is the same thing as finding their longest common subsequence, and you build it twice: first a correct dynamic-programming baseline so you always have a known-good answer, then Eugene Myers' greedy O(ND) algorithm - the edit graph, the k-diagonals, the snakes, and the furthest-reaching V array that finds the minimal edit distance and lets you backtrack a concrete edit script.

  On top of that engine you produce real output: group the edit script into hunks with context lines, emit the unified diff format (the @@ -start,len +start,len @@ headers and the space, minus, and plus line prefixes), merge nearby hunks, and handle the awkward edges - a change on the first or last line, a missing trailing newline, an empty file. Then you build a patch applier that parses a unified diff and reconstructs the target, rejecting a hunk whose context does not match, and the capstone proves the round-trip: applying your own diff of two real documents reproduces the target exactly.

  This is a teaching-grade but genuinely correct diff library, built around the classic Myers design. It works on lines (not words or characters), uses the greedy forward algorithm with a recorded trace to recover the script, and emits and applies standard unified diffs. It is honest about what it stops short of: it does not do the linear-space middle-snake refinement, word-level or syntax-aware diffing, fuzzy patch application, rename or copy detection, or binary files - exactly the extensions that tools like git and GNU diffutils layer on top of this same core. The finalize pass adds a runnable diff CLI that diffs two files (or a built-in demo) with a configurable context, and applies a patch back.
parts:
  - name: 'The edit model and an LCS baseline'
    count: 6
  - name: 'The Myers greedy algorithm'
    count: 6
  - name: 'Recovering the edit script'
    count: 5
  - name: 'Producing a unified diff'
    count: 6
  - name: 'Applying patches and the round-trip'
    count: 5
caveats:
  note: 'A genuinely working, standards-matching line diff - Myers O(ND) edit scripts (cross-checked against an LCS baseline), unified-diff output with context lines, hunk merging, the no-newline marker, and a context-checking patch applier that proves apply(a, diff(a, b)) == b, plus a runnable diff CLI (file diff, -U context, -demo, and -apply) - but it diffs whole lines only (not words or characters), uses the greedy forward Myers pass with a recorded trace rather than the linear-space middle-snake, applies patches by exact context match with no fuzzy offset search, handles one file per patch, and drops the no-final-newline marker on parse so a re-applied patch always ends in a newline.'
  future:
    - 'Preserve the no-final-newline information through Parse and Apply so a round-tripped patch is byte-exact even when the target file has no trailing newline'
    - 'Add fuzzy patch application that tolerates small line-offset shifts and reports the applied offset, the way GNU patch does, instead of requiring an exact context match'
    - 'Implement the linear-space middle-snake (divide-and-conquer) Myers variant so very large inputs need not hold the whole trace in memory'
    - 'Add word-level or character-level diffing and intraline highlighting on top of the line diff for finer-grained output'
    - 'Support multi-file patches (the diff --git a/... b/... headers) so one patch file can carry several files at once'
    - 'Make Parse strict - reject malformed or unrecognized lines rather than silently skipping them'
resources:
  - title: 'An O(ND) Difference Algorithm and Its Variations'
    author: 'Eugene W. Myers'
    url: 'http://www.xmailserver.org/diff2.pdf'
    note: 'The 1986 paper this whole project implements. It frames diffing as a shortest path through an edit graph and derives the greedy O(ND) algorithm, the V array of furthest-reaching paths, and the linear-space middle-snake refinement. Dense but foundational - read it alongside the lessons.'
  - title: 'The Myers diff algorithm'
    author: 'James Coglan'
    url: 'https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/'
    note: 'A three-part blog series that walks Myers'' paper into working code step by step - the edit graph, the forward pass, storing the trace, and backtracking to build the diff. The clearest modern explanation of exactly what these lessons build.'
  - title: 'GNU Diffutils Manual: Unified Format'
    author: 'Free Software Foundation'
    url: 'https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html'
    note: 'The authoritative description of the unified diff format your output must match: the ---/+++ file header, the @@ -start,count +start,count @@ hunk header (and when the count is omitted), the line prefixes, and the "no newline at end of file" marker.'
  - title: 'An O(NP) Sequence Comparison Algorithm'
    author: 'Sun Wu, Udi Manber, Gene Myers, Webb Miller'
    url: 'https://publications.mpi-cbg.de/Wu_1990_6334.pdf'
    note: 'The 1990 follow-up that sharpens Myers to O(NP) where P is the number of deletions - the refinement most production diff libraries (including git''s xdiff) actually use once you have the O(ND) core down.'
  - title: 'Diff Strategies'
    author: 'Neil Fraser'
    url: 'https://neil.fraser.name/writing/diff/'
    note: 'A practical survey from the author of diff-match-patch: pre- and post-processing tricks, choosing granularity (line vs word vs character), and cleanup heuristics that turn a mathematically minimal diff into a human-readable one.'
---
