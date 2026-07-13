---
title: 'Build an LRU and LFU Cache'
order: 43
lessons: 23
size: 'Small'
tech: ['LRU eviction', 'LFU eviction', 'Doubly-linked lists']
estMin: 20
desc: 'Build two fixed-capacity caches from first principles - an LRU cache and an LFU cache - each with O(1) Get and Put. Start with the cache contract on a plain map, add a doubly-linked list with sentinel head and tail so recency moves are O(1), make a hit promote its entry to the front and eviction remove the tail, then build an LFU cache with a per-frequency list and a minFreq pointer. Add per-entry TTL, runtime resize, and hit/miss stats, and finish by running one scripted workload through both caches to show exactly where least-recently-used and least-frequently-used diverge.'
blurb: 'Model a cache as a capacity, a Get that counts as a use, and eviction when full - then make every operation O(1). Each lesson pins an exact outcome: the least-recently-used key evicted after a scripted access order, a Get promoting a key so a later Put evicts a different one, an update promoting a key without growing the cache, capacity-1 evicting on every new key, the least-frequently-used key evicted with ties broken by recency, minFreq resetting to 1 on a fresh insert, and a TTL-expired Get missing.'
overview: |
  Over 23 lessons you build two working caches from scratch - a least-recently-used (LRU) cache and a least-frequently-used (LFU) cache - each a small library with a fixed capacity, a Get and a Put, and O(1) eviction. Keys and values are integers so every step has an exact, assertable outcome: the precise key evicted, the exact hit and miss counts, and the exact remaining contents after a scripted sequence of operations.

  You start with the cache contract on a plain map - store and retrieve, a capacity and a length, updating a key in place - as a simple insertion-order (FIFO) cache. Then you make it a real LRU: a doubly-linked list with sentinel head and tail nodes so there are no nil edge cases, a map from key to node for O(1) lookup, a hit that promotes its node to the front, and eviction that removes the tail. Next you build an LFU cache the O(1) way - a per-frequency list of keys plus a minFreq pointer, moving an entry from one frequency list to the next on each use and advancing minFreq when a list empties, with ties broken by least-recently-used. Finally you add per-entry TTL expiry, runtime resize, and hit/miss stats, and run one scripted workload through both caches to show exactly where the two eviction policies diverge.

  This is a teaching-grade pair of caches built around the classic LeetCode LRU and LFU designs and the O(1) LFU scheme of Shah, Mitra, and Matani. Both caches are single-threaded and hold integer keys and values in one process, with no locking, no persistence, and a logical clock for TTL rather than wall-clock time - the honest core that production caches like Redis and Caffeine extend with concurrency, real time, admission policies, and memory accounting.
parts:
  - name: 'The cache contract'
    count: 4
  - name: 'LRU with a doubly-linked list'
    count: 6
  - name: 'LFU eviction'
    count: 6
  - name: 'TTL, resize, and stats'
    count: 4
  - name: 'The capstone'
    count: 3
caveats:
  note: 'A genuinely working pair of caches - O(1) Get and Put for both an LRU (doubly-linked list with sentinel nodes) and an LFU (per-frequency list plus a minFreq pointer), with per-entry TTL, runtime resize, hit/miss stats, and an eviction log, now panic-free at the capacity-0 edge - but both hold integer keys and values in a single thread with no locking, use a logical clock for TTL (LRU only), and carry one documented TTL zero-sentinel quirk.'
  future:
    - 'Make the caches generic over any comparable key and any value type instead of fixed integer keys and values'
    - 'Add thread safety (a lock around each cache, exercised under the race detector) so an LRU or LFU cache can be shared across goroutines or threads'
    - 'Fix the TTL zero-sentinel collision (a TTL of 0 at clock 0 reads as never-expiring) with an explicit has-expiry flag, and give the LFU cache TTL parity'
    - 'Replace the logical TTL clock with real wall-clock time and a background reaper so stale entries are reclaimed without waiting for a Get'
    - 'Add a size-aware capacity (bytes rather than entry count) with a per-entry cost, the way real caches bound memory'
    - 'Add an admission policy such as TinyLFU so a one-hit-wonder cannot evict a frequently-used entry, the direction Caffeine and Redis take'
resources:
  - title: 'LRU Cache (LeetCode 146)'
    url: 'https://leetcode.com/problems/lru-cache/'
    note: 'The canonical LRU problem: a fixed-capacity cache with O(1) get and put. The classic hashmap plus doubly-linked list design this project builds, stated as a single exact-behavior exercise.'
  - title: 'LFU Cache (LeetCode 460)'
    url: 'https://leetcode.com/problems/lfu-cache/'
    note: 'The canonical LFU problem: evict the least-frequently-used key, breaking ties by least-recently-used, all in O(1). The per-frequency list and minFreq design of the LFU chapter.'
  - title: 'An O(1) Algorithm for Implementing the LFU Cache Eviction Scheme'
    author: 'Ketan Shah, Anirban Mitra, Dhruv Matani'
    url: 'http://dhruvbird.com/lfu.pdf'
    note: 'The short paper that shows LFU insert, access, and eviction can all be O(1) using frequency-keyed doubly-linked lists. The exact structure behind lessons 15 through 17.'
  - title: 'Redis key eviction (maxmemory-policy)'
    url: 'https://redis.io/docs/latest/develop/reference/eviction/'
    note: 'How a production cache chooses what to evict: the allkeys-lru, allkeys-lfu, and volatile-ttl policies, and why Redis approximates LRU and LFU with sampling rather than exact lists.'
  - title: 'Design of a Modern Cache (Caffeine)'
    author: 'Ben Manes'
    url: 'https://github.com/ben-manes/caffeine/wiki/Design'
    note: 'A systems writeup on designing a high-performance cache: eviction policy tradeoffs, the W-TinyLFU admission filter, and why neither pure LRU nor pure LFU is enough in practice.'
  - title: 'ARC: A Self-Tuning, Low Overhead Replacement Cache'
    author: 'Nimrod Megiddo, Dharmendra S. Modha'
    url: 'https://www.usenix.org/legacy/events/fast03/tech/full_papers/megiddo/megiddo.pdf'
    note: 'The classic paper that balances recency and frequency in one policy, the natural next step once you have built both an LRU and an LFU cache and seen where they diverge.'
---
