---
title: 'Build a Bloom Filter and Probabilistic Sketches'
order: 42
lessons: 28
size: 'Small'
tech: ['Bloom filters', 'Count-Min sketch', 'HyperLogLog']
estMin: 20
desc: 'Build a library of probabilistic data structures from first principles - the sketches that answer "have I seen this?", "how often?", and "how many distinct?" in a fraction of the memory an exact answer would need. Start with a deterministic hash pair and a bit array, build a Bloom filter with tunable false positives and no false negatives, add a counting Bloom filter with delete, a Count-Min sketch for frequency estimation, and a HyperLogLog for distinct counting - ending in one library that runs a real stream through all three with exact, reproducible bit, counter, and register states.'
blurb: 'Every sketch trades a little accuracy for a lot of memory, and every lesson pins the trade with exact values: the precise bits an Add sets, the k double-hash indices for a known input, the optimal m and k for a target false-positive rate, a deliberately constructed false positive, an add-then-delete that restores the counters, the minimum across Count-Min rows beating a colliding single row, and a HyperLogLog register holding the maximum leading-zero count. The hash functions are specified exactly - FNV-1a plus a splitmix64 mix - so every index, counter, and register is deterministic and checkable in any language.'
overview: |
  Over 28 lessons you build a small library of probabilistic data structures: the space-efficient sketches that trade exact answers for tiny, fixed memory. You start with the two primitives everything rests on - a deterministic pair of hash functions (a specified FNV-1a and a splitmix64 mix) and a bit array - then build four sketches on top of them, each answering a different question about a stream of items.

  The Bloom filter answers "have I possibly seen this?" with no false negatives and a tunable false-positive rate; you derive its sizing math and construct an actual false positive. A counting Bloom filter adds delete by replacing bits with small saturating counters. A Count-Min sketch estimates how often each item appeared, using the minimum across independent rows to stay an over-estimate that never reads low. A HyperLogLog estimates how many distinct items a stream held from a handful of registers, using leading-zero counts and a harmonic mean. The project ends by running one deterministic stream through all three at once and asserting the exact bit, counter, and register states.

  Because the hash functions are pinned exactly rather than borrowed from the language runtime, every index, counter, and register in every lesson is reproducible in any language. This is a teaching-grade library built around the classic papers (Bloom 1970, Cormode and Muthukrishnan, Flajolet and colleagues): it uses a single deterministic hash pair rather than a full independent hash family, small register and counter widths chosen for hand-checkable examples, and no serialization, merging, or concurrency - which is exactly the honest core that production libraries like RedisBloom and the sketches in data-warehouse engines extend.
parts:
  - name: 'Bits and deterministic hashing'
    count: 5
  - name: 'The Bloom filter'
    count: 6
  - name: 'The counting Bloom filter'
    count: 3
  - name: 'The Count-Min sketch'
    count: 5
  - name: 'HyperLogLog'
    count: 6
  - name: 'The streaming capstone'
    count: 3
caveats:
  note: 'A genuinely working library of four probabilistic sketches - a Bloom filter with tunable false positives and no false negatives, a counting Bloom filter with delete and saturating counters, a Count-Min sketch for frequency, and a HyperLogLog for distinct counting, each with its sizing helpers, a runnable demo, and graceful handling of degenerate parameters - but it uses a single deterministic double-hashed hash pair rather than a fully independent hash family, small fixed counter and register widths chosen for hand-checkable examples, and has no serialization, merging, or concurrency safety.'
  future:
    - 'Add serialization (marshal and unmarshal) and a merge or union operation so two same-sized sketches built on separate streams can be combined into one'
    - 'Make the sketches concurrency-safe (a lock or sharding) so several producers can update one sketch at the same time'
    - 'Replace the double-hashing shortcut with a genuinely independent hash family, and widen the counters and registers, to tighten accuracy on large inputs'
    - 'Add a scalable or blocked Bloom filter that grows as it fills instead of committing to a fixed bit array sized up front'
    - 'Add HyperLogLog''s large-cardinality corrections (a 32-bit-register variant and the register bias correction) so distinct-count estimates stay accurate at very high cardinalities'
resources:
  - title: 'Space/Time Trade-offs in Hash Coding with Allowable Errors'
    author: 'Burton H. Bloom'
    url: 'https://dl.acm.org/doi/10.1145/362686.362692'
    note: 'The original 1970 paper that introduced the Bloom filter - a bit array plus several hash functions, trading a small false-positive rate for a large space saving. Short, readable, and the source of the sizing math this project derives.'
  - title: 'Less Hashing, Same Performance: Building a Better Bloom Filter'
    author: 'Adam Kirsch, Michael Mitzenmacher'
    url: 'https://www.eecs.harvard.edu/~michaelm/postscripts/rsa2008.pdf'
    note: 'Shows that the k hash functions a Bloom filter needs can be generated from just two base hashes by double hashing, with no loss of accuracy - the exact trick used here to turn one FNV-1a and one splitmix64 mix into k indices.'
  - title: 'Network Applications of Bloom Filters: A Survey'
    author: 'Andrei Broder, Michael Mitzenmacher'
    url: 'https://www.eecs.harvard.edu/~michaelm/postscripts/im2005b.pdf'
    note: 'A wide survey of Bloom filter variants and uses, including the counting Bloom filter that adds delete. Good context for where these structures show up in real systems.'
  - title: 'An Improved Data Stream Summary: The Count-Min Sketch and its Applications'
    author: 'Graham Cormode, S. Muthukrishnan'
    url: 'http://dimacs.rutgers.edu/~graham/pubs/papers/cm-full.pdf'
    note: 'The Count-Min sketch paper: a two-dimensional counter grid with one hash per row, answering frequency queries by taking the minimum across rows. The width-and-depth sizing and the error bound in the Count-Min chapter come straight from here.'
  - title: 'HyperLogLog: the Analysis of a Near-Optimal Cardinality Estimation Algorithm'
    author: 'Philippe Flajolet, Eric Fusy, Olivier Gandouet, Frederic Meunier'
    url: 'http://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf'
    note: 'The HyperLogLog paper - estimating the number of distinct items from the maximum leading-zero count per register, combined with a harmonic mean and a bias correction. The alpha constants and the small-range correction used here are defined in this paper.'
  - title: 'Probabilistic Data Structures and Algorithms for Big Data Applications'
    author: 'Andrii Gakhov'
    url: 'https://www.gakhov.com/books/pdsa.html'
    note: 'A single accessible overview of the whole family - membership, frequency, and cardinality sketches - with worked math and clear diagrams. The best one-book companion to this project.'
---
