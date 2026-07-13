---
title: 'Build a Memory Allocator'
order: 22
lessons: 32
size: 'Small'
tech: ['Free lists', 'Coalescing', 'Boundary tags']
estMin: 20
desc: 'Build a real memory allocator from first principles over a simulated arena - a single backing byte buffer where every allocation returns a deterministic offset. Start with a bump allocator, add block headers and boundary tags, an explicit free list with splitting and coalescing, first-fit and best-fit policies, realloc and calloc, segregated size-class bins, and a heap-integrity checker - ending in an allocator that runs a scripted workload and reports the exact final heap layout with no corruption, leaks, or overlap.'
blurb: 'Model the heap as one byte buffer so malloc, free, and realloc return exact offsets you can assert against - no real pointers, no OS calls. Every lesson is one concrete spec with exact block layouts and free-list states: alignment rounding, splitting a free block, coalescing with the neighbor before, after, and both, first-fit versus best-fit picking different blocks, growing a realloc in place versus relocating it, and detecting a double free.'
overview: |
  Over 32 lessons you build a working memory allocator from scratch, modelled as a simulated arena: one fixed backing byte buffer where every allocation returns a deterministic offset into it. That design keeps the whole thing exactly testable - real block layouts, real free-list states, real addresses - with no true pointers and no operating-system calls, so the allocator you write is the same in any language.

  You start with a bump allocator that advances a cursor to get something usable immediately, then build the real thing: blocks carrying a header and a matching footer (boundary tags), an explicit free list, first-fit search, splitting a large free block, and coalescing a freed block with the free neighbour before it, after it, and on both sides. On top of that core you add first-fit versus best-fit fit policies, realloc that shrinks in place, grows in place by absorbing a following free block, or relocates and copies, calloc that zeroes, segregated size-class bins for faster allocation, and a heap-integrity checker. The capstone runs a scripted allocate, free, and realloc workload and asserts the exact final heap layout.

  This is a teaching-grade allocator built around the classic boundary-tag design from CS:APP and Knuth: it manages one fixed arena, is single-threaded, and returns offsets rather than mapping real memory. It is honest about what it stops short of - it never calls the operating system to grow the heap (no sbrk or mmap), has no thread safety, and uses a simplified set of size classes - which is exactly the honest core that production allocators like dlmalloc, jemalloc, and tcmalloc extend with arenas, per-thread caches, and OS integration.
parts:
  - name: 'The arena and a bump allocator'
    count: 6
  - name: 'Blocks and the implicit free list'
    count: 7
  - name: 'The explicit free list and coalescing'
    count: 5
  - name: 'Fit policies, realloc, and calloc'
    count: 6
  - name: 'Size classes, integrity, and the capstone'
    count: 8
caveats:
  note: 'A genuinely working allocator over a single fixed simulated arena - boundary-tagged blocks, segregated size-class bins, splitting and both-sided coalescing, first-fit and best-fit, realloc and calloc, a heap-integrity checker, and graceful rejection of double frees and bad offsets - but it manages one fixed arena that never grows (no OS sbrk or mmap), is single-threaded with no locking, returns integer offsets rather than real pointers, and uses five fixed size-class bins.'
  future:
    - 'Add thread safety (a lock around the bins and backing buffer) so the allocator can be shared across goroutines or threads'
    - 'Support a growable backing arena that requests more memory when full instead of failing at the initial size (the teaching equivalent of sbrk or mmap)'
    - 'Replace the linear offset validation and free-block search with O(1) structures (a block-start bitmap, doubly-linked bins) and poison freed memory to catch use-after-free'
    - 'Add more and finer size-class bins (or power-of-two classes) so large allocations bin as precisely as small ones'
    - 'Give calloc the real count-times-size signature with a multiplication-overflow guard, and add aligned-allocation support for over-aligned requests'
    - 'Add per-thread caches or arenas (the tcmalloc / jemalloc direction) to cut contention once locking is in place'
resources:
  - title: 'Computer Systems: A Programmer''s Perspective'
    author: 'Randal E. Bryant, David R. O''Hallaron'
    url: 'https://csapp.cs.cmu.edu/'
    note: 'Section 9.9 (Dynamic Memory Allocation) and the famous malloc lab are the backbone of this project - implicit and explicit free lists, boundary tags, splitting, coalescing, and fit policies, all laid out step by step.'
  - title: 'A Memory Allocator'
    author: 'Doug Lea'
    url: 'https://gee.cs.oswego.edu/dl/html/malloc.html'
    note: 'The design writeup for dlmalloc, the allocator most system mallocs descend from. Read it for boundary tags, binning by size class, and the real-world tradeoffs a teaching allocator simplifies.'
  - title: 'The C Programming Language (2nd edition)'
    author: 'Brian W. Kernighan, Dennis M. Ritchie'
    note: 'Section 8.7 builds a storage allocator in a few pages - a free list of blocks threaded through the arena, coalescing on free, and a circular first-fit search. The smallest complete allocator worth reading.'
  - title: 'A malloc Tutorial'
    author: 'Marwan Burelle'
    url: 'https://danluu.com/malloc-tutorial/'
    note: 'A from-scratch walkthrough of writing malloc, free, and realloc with block metadata and coalescing - the practical companion to the CS:APP chapter.'
  - title: 'Writing a Memory Allocator'
    author: 'Dmitry Soshnikov'
    url: 'http://dmitrysoshnikov.com/compilers/writing-a-memory-allocator/'
    note: 'A modern, well-illustrated treatment of headers, alignment, free-list search, splitting, coalescing, and segregated lists - closely parallel to the arc built here.'
  - title: 'The Art of Computer Programming, Volume 1: Fundamental Algorithms'
    author: 'Donald E. Knuth'
    note: 'Section 2.5 (Dynamic Storage Allocation) is the original rigorous treatment of boundary tags, first-fit versus best-fit, and the fragmentation tradeoffs every allocator negotiates.'
---
