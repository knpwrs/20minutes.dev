---
title: 'Build a Garbage Collector'
order: 32
lessons: 32
size: 'Small'
tech: ['Tracing GC', 'Mark and sweep', 'Copying collection']
estMin: 20
desc: 'Reclaim memory automatically: trace reachability, then build mark-sweep and copying collectors.'
blurb: 'Model the heap as a table of objects addressed by integer ids so tracing, marking, sweeping, and copying all return exact ids you can assert against - no real pointers, no host GC to fight. Every lesson is one concrete spec with exact surviving and reclaimed id sets: tracing the reachable set from the roots, a reachable cycle that survives while an unreachable cycle is reclaimed (the case reference counting cannot collect), the tri-color mark loop with no black object pointing to a white one, sweep reclaiming exactly the white set, allocation that collects and retries or returns out of memory, and a copying collector that copies a shared object exactly once and compacts the survivors.'
overview: |
  Over 32 lessons you build a working tracing garbage collector from scratch, modelled over a simulated heap: a table of objects where every object is addressed by an integer object id (a Ref) and holds a small set of fields that are themselves Refs, plus an explicit root set. Because you cannot intercept a host language's real pointers, this simulated heap makes every collection fully deterministic and exactly testable - you can assert precisely which ids survive, which are reclaimed, and the exact free space and new addresses. It is the same simulated-heap discipline as the companion Build a Memory Allocator project, one level up: there you handed out memory, here you reclaim it automatically.

  You start with the object model - allocating objects, wiring their reference fields into a graph, and the root set - then compute reachability by tracing from the roots, handling shared objects and cycles (a cycle reachable from a root survives; an unreachable cycle is garbage, the exact case reference counting cannot collect). On that foundation you build a full tri-color mark-sweep collector: greying the roots, blackening the reachable set, sweeping every still-white object into a free list, and allocation that triggers a collection and retries or fails cleanly with out of memory. Then you build a second collector - a copying semispace collector using Cheney's algorithm - that copies each reachable object to a fresh space leaving a forwarding pointer, updates every reference, copies a doubly-referenced object exactly once, and compacts the survivors as a side effect. The capstone runs both collectors over one graph with a shared node, a root-reachable cycle, and an unreachable cycle and asserts the exact surviving and reclaimed ids.

  This is a teaching-grade tracing garbage collector built as a library: a managed heap plus mark-sweep and copying collectors you import and drive through a small API. It is honest about what it stops short of - it collects only when you call it or when allocation runs out (it is stop-the-world, not concurrent or incremental), it introduces write barriers and a remembered set as a sketch rather than a full generational collector, and it has no finalizers or weak references - which is exactly the honest core that production collectors extend with concurrency, generations, and compaction refinements.
parts:
  - name: 'The object model and heap'
    count: 6
  - name: 'Reachability and tracing'
    count: 6
  - name: 'Mark-sweep and triggering a collection'
    count: 8
  - name: 'Fragmentation and a copying collector'
    count: 7
  - name: 'Refinements and the capstone'
    count: 5
caveats:
  note: 'The core tracing GC (mark-sweep and copying, with roots, cycles, a write barrier, and a remembered-set sketch) is complete and robust to bad input, but generational collection, incrementality, heap growth, and a real pointer/memory model are intentionally left as future work.'
  future:
    - 'Wire the remembered set into an actual young-generation minor collection instead of leaving it a sketch, and promote survivors to the old generation'
    - 'Let heaps grow when a collection frees too little, instead of only ever failing once full'
    - 'Build an incremental or concurrent mark phase that actually exercises the existing write barrier under mutation'
    - 'Add finalizers and weak references so a caller can observe or run cleanup code when an object becomes unreachable'
    - 'Model real memory (object headers, per-field sizes, a byte-addressed heap) instead of integer slot ids, to support a bytes-moved and bytes-scanned cost model'
resources:
  - title: 'The Garbage Collection Handbook: The Art of Automatic Memory Management'
    author: 'Richard Jones, Antony Hosking, Eliot Moss'
    url: 'https://gchandbook.org/'
    note: 'The definitive modern reference. Chapters on mark-sweep, copying collection, reference counting, and generational and incremental collection map directly onto this project - read it for the tri-color abstraction and Cheney''s algorithm in full rigour.'
  - title: 'A Nonrecursive List Compacting Algorithm'
    author: 'C. J. Cheney'
    url: 'https://dl.acm.org/doi/10.1145/362790.362798'
    note: 'The 1970 paper that introduced the copying collector this project builds in Chapter 4 - two semispaces, forwarding pointers, and a breadth-first scan that needs no recursion or extra stack. Two pages, still the clearest statement of the idea.'
  - title: 'Uniprocessor Garbage Collection Techniques'
    author: 'Paul R. Wilson'
    url: 'https://link.springer.com/chapter/10.1007/BFb0017182'
    note: 'The classic survey (IWMM 1992) that maps the whole design space - mark-sweep, copying, generational, and incremental collection and the tradeoffs between them. The best single orientation to where the collectors here sit among the alternatives.'
  - title: 'On-the-Fly Garbage Collection: An Exercise in Cooperation'
    author: 'Edsger W. Dijkstra, Leslie Lamport, A. J. Martin, C. S. Scholten, E. F. M. Steffens'
    url: 'https://dl.acm.org/doi/10.1145/359642.359655'
    note: 'The 1978 paper that introduced the white/gray/black tri-color abstraction and the invariant this project leans on. The source for why a write barrier is needed once the program can run during marking.'
  - title: 'Baby''s First Garbage Collector'
    author: 'Robert Nystrom'
    url: 'https://journal.stuffwithstuff.com/2013/12/08/babys-first-garbage-collector/'
    note: 'A short, readable mark-sweep collector built in a single sitting - roots, reachability, the mark phase, and the sweep. The gentlest possible on-ramp to the core this project formalizes.'
  - title: 'Crafting Interpreters, Chapter 26: Garbage Collection'
    author: 'Robert Nystrom'
    url: 'https://craftinginterpreters.com/garbage-collection.html'
    note: 'A tri-color mark-sweep collector inside a working language, with a tricolor worklist, the roots, and the write-barrier-adjacent gotchas explained clearly - the practical companion to the tri-color chapter here.'
---
