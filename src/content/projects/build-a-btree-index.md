---
title: 'Build a B+Tree Index'
order: 33
lessons: 45
size: 'Medium'
tech: ['B+Trees', 'Paging', 'Copy-on-write']
estMin: 20
desc: 'Build an on-disk, crash-safe B+Tree index from first principles: fixed-size pages, a pager, serialized leaf and internal nodes, search, splits, deletes with rebalancing, ordered range scans, a file-backed pager, and copy-on-write commits with a double meta page that survive a crash mid-write.'
blurb: 'Every node is a fixed-size page from lesson one, so the index genuinely lives on disk and never leans on host pointers or the garbage collector. Grow it one durable piece at a time - pages, nodes, search, splits, deletes, range scans - then move it to a real file and make writes crash-safe with copy-on-write and an atomic double-meta swap. The capstone crashes it mid-write and proves every committed key survived.'
overview: |
  Over 45 lessons you build a working B+Tree index that lives on disk and survives a crash. From the very first lesson a tree node IS a fixed-size 4096-byte page addressed by an integer page id and reached through a pager (AllocPage, ReadPage, WritePage, FreePage), so nothing ever relies on in-memory pointers or the garbage collector. You serialize leaf and internal nodes to exact bytes, search by descending page to page, insert with leaf and internal splits that keep every leaf at equal depth, delete with borrow-and-merge rebalancing, and answer ordered range scans by walking leaf sibling links.

  The core runs on an in-memory pager, so the move to disk is a pager swap, not a rewrite: a file-backed pager maps page id to file offset, a meta page names the root and a free list recycles pages, and the index reopens from its file with every key intact. Then you make writes crash-safe with copy-on-write and a double meta page - a write copies every page it touches to a fresh page, never overwriting a live one, then publishes atomically by fsyncing a new meta slot chosen by sequence number and checksum. The capstone writes a batch, simulates a crash with no clean close, reopens the file, and proves every committed key is present with the tree invariants intact.

  This is a teaching-grade index built around the real design used by SQLite and LMDB: a single-writer, crash-safe on-disk B+Tree you import as a library (Open, Get, Put, Delete, Scan, Close). It stops short of what a production engine adds - concurrent transactions and MVCC readers, variable-length keys and overflow pages, and the write-ahead-log durability path this project deliberately leaves as the alternative to copy-on-write.
parts:
  - name: 'Pages and the pager'
    count: 4
  - name: 'The node format'
    count: 6
  - name: 'A one-node index'
    count: 5
  - name: 'Growing the tree'
    count: 7
  - name: 'Delete and rebalance'
    count: 5
  - name: 'Range scans'
    count: 4
  - name: 'On disk'
    count: 6
  - name: 'Crash safety'
    count: 7
  - name: 'Capstone'
    count: 1
caveats:
  note: 'A genuinely crash-safe on-disk B+Tree index - copy-on-write writes published through a checksummed double meta page, proven by tests to survive a crash mid-write with every committed key present and all invariants intact - but single-writer, built at a small teaching fanout, with a simplified durable delete and free-page reclamation, so it is a teaching-grade index rather than a production one.'
  future:
    - 'Replace the durable delete''s whole-tree copy with a path-limited copy-on-write delete (sibling-aware borrow and merge) so a crash-safe delete is O(log n) instead of O(tree size)'
    - 'Add a transaction-aware free list so pages orphaned by a copy-on-write write are safely reclaimed once the previous commit no longer references them, instead of leaking'
    - 'Add MVCC read snapshots and a single-writer lock so concurrent readers can run against a stable root while one writer commits'
    - 'Support variable-length keys and values, with overflow pages for large ones, instead of fixed 8-byte keys and values'
    - 'Rework leaf-chain maintenance so a copy-on-write insert is not O(leaves to its left) when re-pointing the sibling links'
    - 'Offer the write-ahead-log durability alternative (log plus replay on open) alongside copy-on-write, and run at the real page fanout instead of the small teaching order'
resources:
  - title: 'The Ubiquitous B-Tree'
    author: 'Douglas Comer'
    url: 'https://dl.acm.org/doi/10.1145/356770.356776'
    note: 'The classic 1979 survey that names the B-tree and B+Tree variants, the fanout math, and the split and merge rules this project implements.'
  - title: 'The SQLite Database File Format'
    url: 'https://www.sqlite.org/fileformat2.html'
    note: 'A production on-disk B+Tree file format: fixed-size pages, a header page naming the root, leaf and interior page layouts - the concrete counterpart to the format you build.'
  - title: 'Architecture of SQLite'
    url: 'https://www.sqlite.org/arch.html'
    note: 'How the pager, the B-tree module, and the file interact - the layered design this project mirrors, pager underneath and tree on top.'
  - title: 'LMDB: Lightning Memory-Mapped Database'
    author: 'Howard Chu'
    url: 'https://www.symas.com/lmdb'
    note: 'The copy-on-write plus double-meta-page design the crash-safety chapter follows: never overwrite a live page, publish atomically by fsyncing the older of two meta pages.'
  - title: 'Database Internals'
    author: 'Alex Petrov'
    url: 'https://www.databass.dev/'
    note: 'Part I is a deep tour of on-disk B-trees: page layout, splits and merges, rebalancing, and the durability machinery - the reference textbook for everything here.'
---
