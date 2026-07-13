---
title: 'Build a Spell Checker'
order: 11
lessons: 40
size: 'Medium'
tech: ['Edit distance', 'BK-trees', 'Candidate generation']
estMin: 20
desc: 'Flag misspelled words and rank corrections with edit distance and a BK-tree index.'
blurb: 'Start with a word set that answers "known or unknown" and end with a runnable checker that reads a paragraph and prints each misspelling with its line, column, and ranked "did you mean" suggestions. Every lesson is one concrete spec: edit distance, deletes/transposes/replaces/inserts, a frequency model, and a metric tree that prunes the search so you never scan the whole dictionary.'
overview: |
  Over 40 lessons you build a working spell checker from scratch: a case-insensitive dictionary you can query and load from a word list, a tokenizer that splits text into words and remembers where each one sits, Levenshtein edit distance (plus adjacent transposition) as the measure of how far a typo is from a real word, Norvig-style candidate generation that turns a misspelling into the real words one or two edits away, a frequency model that ranks those candidates so the likeliest correction wins, and a BK-tree index whose triangle-inequality pruning finds nearby words without scanning the whole dictionary.

  By the end you have a runnable tool: give it a paragraph and it flags every word not in the dictionary, reports each one by line and column, and prints ranked "did you mean" suggestions, with a personal ignore list for words you want it to accept. The capstone runs the finished checker over a real multi-line paragraph of prose and produces a full report.

  This is a teaching-grade checker built around the real Norvig-plus-BK-tree design: it corrects one word at a time by edit distance and word frequency, and it is honest about what it does not do - it has no sense of context or grammar, so it cannot fix a correctly-spelled wrong word ("their" for "there"), and it works on English-like ASCII words rather than full Unicode. What you finish with is the honest core that production spell checkers extend with context models and richer language data.
parts:
  - name: 'Words and the dictionary'
    count: 7
  - name: 'Measuring edits'
    count: 5
  - name: 'Generating candidates'
    count: 7
  - name: 'Ranking corrections'
    count: 6
  - name: 'A fast candidate index'
    count: 7
  - name: 'The spell-checking tool'
    count: 8
caveats:
  note: 'A genuinely working single-word spell checker - case-insensitive dictionary, edit-distance candidate generation, frequency ranking, and a BK-tree index behind a runnable CLI that reports misspellings with line, column, and ranked suggestions - but it corrects each word in isolation, with no sense of context or grammar, and generates candidates over the ASCII letters a-z only.'
  future:
    - 'Add a context / language model (word bigrams) so real-word errors like "their" for "there" can be caught and candidates re-ranked by surrounding words'
    - 'Broaden candidate generation beyond ASCII a-z by deriving the alphabet from the dictionary, so accented and non-Latin words are correctable'
    - 'Persist and incrementally update the dictionary, frequency counts, and BK-tree index so a large word list loads once instead of every run'
    - 'Ship or load a real frequency corpus so ranking reflects genuine word commonness rather than a flat count-of-one'
    - 'Add more skip rules for non-prose tokens (URLs, code, numbers with units) and a persistent personal dictionary file'
    - 'Try a SymSpell deletion-index as a faster alternative to the BK-tree and compare the two'
resources:
  - title: 'How to Write a Spelling Corrector'
    author: 'Peter Norvig'
    url: 'https://norvig.com/spell-correct.html'
    note: 'The 21-line spelling corrector this project is built around - candidate generation by edits, a word-frequency model, and the candidate ladder. Read it first.'
  - title: 'Speech and Language Processing'
    author: 'Daniel Jurafsky, James H. Martin'
    url: 'https://web.stanford.edu/~jurafsky/slp3/'
    note: 'The minimum-edit-distance and spelling-correction chapters derive the exact Levenshtein DP and the noisy-channel ranking model used here, with the linguistics behind them.'
  - title: 'Some Approaches to Best-Match File Searching'
    author: 'W. A. Burkhard, R. M. Keller'
    url: 'https://dl.acm.org/doi/10.1145/362003.362025'
    note: 'The 1973 paper that introduced the BK-tree: a metric tree that uses the triangle inequality of a distance function to search by radius - the index in chapter five.'
  - title: 'Damn Cool Algorithms: BK-Trees'
    author: 'Nick Johnson'
    url: 'http://blog.notdot.net/2007/4/Damn-Cool-Algorithms-Part-1-BK-Trees'
    note: 'A clear, worked walkthrough of building and querying a BK-tree over a dictionary - the practical companion to the original paper.'
  - title: 'SymSpell'
    author: 'Wolf Garbe'
    url: 'https://github.com/wolfgarbe/SymSpell'
    note: 'A faster alternative index built on a precomputed deletion dictionary - the natural next structure to try after the BK-tree, and a good second-pass project.'
  - title: 'The Levenshtein Algorithm'
    author: 'Vladimir Levenshtein (1965)'
    note: 'The original definition of edit distance as insertions, deletions, and substitutions - the correctness core every candidate in this project is measured against.'
---
