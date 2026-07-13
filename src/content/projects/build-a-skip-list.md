---
title: 'Build a Skip List'
order: 41
lessons: 24
size: 'Small'
tech: ['Skip lists', 'Probabilistic balancing', 'Ordered maps']
estMin: 20
desc: 'Build an ordered map on a skip list: randomized towers, search, and O(log n) rank and select.'
blurb: 'Model a skip list as towers of forward pointers with a head sentinel, and keep it exactly testable by driving every random level from a self-defined seeded LCG - so a given seed always produces the same structure. Every lesson is one concrete spec with exact towers, visited search paths, and results: the top-down drop-down search, an insert that raises the list level, a duplicate key updating in place, a delete that lowers the level, a range query with exact bounds, and a select-by-rank returning the k-th element.'
overview: |
  Over 24 lessons you build an ordered map backed by a skip list: a linked structure where each node carries a tower of forward pointers, and the taller towers act as express lanes that let search skip ahead and run in expected O(log n) time. Because a real skip list picks tower heights at random, the whole thing would be impossible to pin down with exact values - so you drive every coin flip from a small self-defined seeded generator (a linear congruential generator you write yourself). A given seed always produces exactly the same towers, which keeps every insert, delete, and search fully reproducible and testable.

  You start with a sorted level-0 skeleton and the classic top-down search that drops down a level whenever it cannot move right, then add the seeded level generator, insert with the predecessor "update" array (raising the list level when a new tower is taller than any before it), a duplicate key that updates in place rather than duplicating, and delete that unlinks a node from every level and lowers the list level when the top lanes empty. On top of that core you add in-order iteration, range queries with exact half-open bounds, successor and min and max lookups, and finally spans - a count of level-0 steps stored on each forward pointer - that turn the structure into an indexable skip list supporting rank (the position of a key) and select (the k-th element) in O(log n). The capstone builds a sorted set from a fixed seed and a known insert and delete sequence and asserts the exact ordered contents, a search's visited path, a range result, and a select-by-rank.

  This is a teaching-grade ordered map: a clean, fully deterministic library with integer keys and values, single-threaded, built around a small fixed maximum tower height so its small examples stay hand-checkable. It is honest about what it stops short of - the seeded LCG is a reproducibility device, not a cryptographic or high-quality generator; the maximum level is a small constant rather than one that grows with the element count; and it holds one fixed comparison type rather than arbitrary comparable keys - which is exactly the honest core that production skip lists like Redis's sorted set extend with a scaling level cap, generic comparators, and a backward pointer for reverse iteration.
parts:
  - name: 'The skip-list structure and search'
    count: 6
  - name: 'Randomized levels and insert'
    count: 6
  - name: 'Delete and ordered operations'
    count: 6
  - name: 'Indexable skip list: spans, rank, and select'
    count: 6
caveats:
  note: 'A complete, well-tested indexable ordered map backed by a skip list - insert, search, delete, in-order iteration, range queries, successor, min and max, and O(log n) rank and select over spans, all fully deterministic from a seed - but it holds int keys and int values only, caps the tower height at a fixed maximum of 4 (so performance degrades toward a linked list beyond roughly 16 elements), drives its levels from a reproducibility-grade seeded LCG rather than a high-quality or cryptographic generator, is single-threaded with no concurrency safety, and iterates forward only.'
  future:
    - 'Make it generic (SkipList[K cmp.Ordered, V any]) instead of hardcoded int keys and values, so any comparable key type works'
    - 'Add backward pointers for a Predecessor (floor) query and reverse iteration'
    - 'Scale the maximum tower height with the element count instead of the fixed cap of 4, so large lists keep their O(log n) search'
    - 'Offer a higher-quality or pluggable random source (alongside the deterministic seeded LCG) for production use where reproducibility is not required'
    - 'Add concurrency safety - a read-write lock or a documented external-synchronization contract with a race-detector test'
    - 'Support bulk operations (build from a sorted slice, merge two lists) that exploit the ordered structure'
resources:
  - title: 'Skip Lists: A Probabilistic Alternative to Balanced Trees'
    author: 'William Pugh'
    url: 'https://15721.courses.cs.cmu.edu/spring2018/papers/08-oltpindexes1/pugh-skiplists-cacm1990.pdf'
    note: 'The original 1990 paper that introduced skip lists. It defines the tower of forward pointers, the randomized level assignment with p = 1/2, and the top-down search and insert algorithms this project builds - the primary source for the whole structure.'
  - title: 'A Skip List Cookbook'
    author: 'William Pugh'
    url: 'https://drum.lib.umd.edu/handle/1903/544'
    note: 'Pugh''s follow-up tech report covering variations, including the indexable skip list: storing a span (a count of level-0 steps) on each forward pointer so you can find the k-th element and a key''s position in O(log n). The basis for the rank and select chapter.'
  - title: 'Redis sorted sets: t_zset.c'
    author: 'Salvatore Sanfilippo and contributors'
    url: 'https://github.com/redis/redis/blob/unstable/src/t_zset.c'
    note: 'A production skip list in the wild. Read zslInsert and zslDeleteNode for span maintenance with the rank array, and zslGetElementByRank for select - the same techniques this project builds, plus the scaling level cap and backward pointer a real implementation adds.'
  - title: 'Open Data Structures'
    author: 'Pat Morin'
    url: 'https://opendatastructures.org/ods-cpp/4_Skiplists.html'
    note: 'A free data-structures textbook whose chapter 4 gives a clean, rigorous treatment of skip lists - the search path, expected height and search cost, and why the randomization yields O(log n) with high probability.'
  - title: 'Skip Lists (MIT 6.046 lecture, Erik Demaine)'
    author: 'Erik Demaine, Srini Devadas'
    url: 'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/'
    note: 'A lecture-level walkthrough of skip lists building intuition for the express-lane analogy, the drop-down search, and the probabilistic O(log n) bound - a good companion to Pugh''s paper.'
---
