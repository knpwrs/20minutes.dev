---
title: 'Build an Autocomplete Engine'
order: 27
lessons: 25
size: 'Small'
tech: ['Tries', 'Prefix search', 'Top-k ranking']
estMin: 20
desc: 'Autocomplete over a trie: ranked completions, cached top-K, and learning from what you pick.'
blurb: 'Model completion as a trie you walk to a prefix node and then read from, so every query returns an exact ranked list you can assert against - no external index, no network. Every lesson is one concrete spec with exact trie shapes, completion lists, and ranked order: shared prefixes reusing nodes, a subtree collected in lexicographic order, top-K broken lexicographically on a weight tie, a cached node top equaling the brute-force scan after an insert, and a recorded selection lifting a term above a previously-higher neighbor.'
overview: |
  Over 26 lessons you build a working autocomplete engine from scratch as a library you import: you add weighted terms, query a prefix to get a ranked list of completions, and record a selection so the engine learns. It is built on a trie (a prefix tree), which keeps every query exactly testable - you walk to the node that ends a prefix and read the completions in its subtree - with no external search index and no network, so the engine you write is the same in any language.

  You start with the trie itself: a node keyed by rune with an end-of-word marker, inserting words so shared prefixes reuse nodes, and membership lookup. Then you add prefix traversal - walk to a prefix node and collect every completion beneath it by depth-first search in deterministic lexicographic order, handling the prefix-is-a-whole-word case, an empty prefix that returns everything, and a missing prefix that returns nothing. On top of that you attach a weight to each term and return the top-K completions ordered by weight with a lexicographic tie-break, then make queries fast by caching each node's best completions so a lookup is O(prefix length + K) instead of scanning the whole subtree. Finally the engine learns: recording a selection bumps a term's weight and re-ranks it, an unseen selection is added on the fly, matching folds case while preserving the display form, terms can be multi-word phrases, and an optional lesson tolerates a single typo in the prefix. The capstone loads a real weighted term list and serves exact ranked completions for several prefixes as you type, re-ranking after each recorded selection.

  This is a teaching-grade autocomplete engine built around the classic trie plus cached-top-K design: it is in-memory, single-threaded, and returns exact ranked lists. It is honest about what it stops short of - it does not persist or distribute the index, it does not compress the trie into a finite-state transducer the way production completion suggesters do, its typo tolerance is limited to a single character substitution in the prefix rather than full edit-distance search, and it has no per-user personalization or context - which is exactly the honest core that systems like Elasticsearch's completion suggester and Google's search box extend with compression, sharding, and ranking signals.
parts:
  - name: 'The trie'
    count: 5
  - name: 'Prefix traversal and completions'
    count: 5
  - name: 'Weighted ranking'
    count: 5
  - name: 'Faster top-K with cached node tops'
    count: 4
  - name: 'Learning, refinements, and the capstone'
    count: 6
caveats:
  note: 'A genuinely working in-memory autocomplete engine - a trie of weighted terms, prefix completions collected in deterministic order, top-K ranking with a lexicographic tie-break, per-node cached top lists for O(prefix + K) reads with a full-scan fallback, learning from recorded selections, case-folding with a preserved display form, phrase terms, and a single-substitution typo fallback, all demoed by a small CLI - but it is single-process and single-threaded, keeps everything in memory (no persistence), has no delete or forget API, caps each node cache at a fixed size, and does not compress the trie the way production suggesters do.'
  future:
    - 'Extend the typo fallback from single-character substitution to a real edit-distance-1 budget (insertions and deletions too), and then to multiple edits'
    - 'Add a Remove or Forget API and a negative-signal counterpart to Record, so terms can be demoted or dropped, not only promoted'
    - 'Persist the trie (save and load) so learned weights survive a restart instead of resetting to the seed list'
    - 'Make the engine safe for concurrent use (a read-write lock around the read and write paths) so it can back a shared service'
    - 'Make the per-node cache capacity a construction option rather than a fixed constant, and document when a large-K query falls back to a full subtree scan'
    - 'Compress the trie into a finite-state transducer (the Lucene direction) so a large weighted term dictionary stays fast and small at scale'
resources:
  - title: 'Algorithms, 4th Edition - Section 5.2, Tries'
    author: 'Robert Sedgewick, Kevin Wayne'
    url: 'https://algs4.cs.princeton.edu/52trie/'
    note: 'The canonical treatment of R-way tries and ternary search tries - node structure, insert, prefix match, and collecting all keys under a subtree. The backbone of this project chapters one and two.'
  - title: 'Ternary Search Trees'
    author: 'Jon Bentley, Robert Sedgewick'
    url: 'https://www.cs.princeton.edu/~rs/strings/'
    note: 'The Dr. Dobb''s article and companion paper "Fast Algorithms for Sorting and Searching Strings" - a space-efficient alternative to the R-way trie that keeps the same prefix-and-completion operations you build here.'
  - title: 'Trie (Wikipedia)'
    url: 'https://en.wikipedia.org/wiki/Trie'
    note: 'A concise reference on the prefix tree: shared prefixes, end-of-word markers, and the tradeoffs against hash tables and ternary search trees.'
  - title: 'System Design Interview - Design A Search Autocomplete System'
    author: 'Alex Xu'
    note: 'A system-design walkthrough of typeahead: a trie of weighted terms, caching each node''s top suggestions for O(prefix + k) queries, and updating weights from usage - the exact shape this library builds in-process.'
  - title: 'Completion Suggester (Elasticsearch Reference)'
    author: 'Elastic'
    url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html'
    note: 'How a production search engine exposes prefix completion with per-term weights and top-K ranking - the same contract as this library, backed by a finite-state transducer instead of a plain trie.'
  - title: 'Using Finite State Transducers in Lucene'
    author: 'Michael McCandless'
    url: 'http://blog.mikemccandless.com/2010/12/using-finite-state-transducers-in.html'
    note: 'The compression step this project deliberately skips: how Lucene stores a weighted term dictionary as an FST so completion stays fast at scale. Read it once the plain trie makes sense.'
---
