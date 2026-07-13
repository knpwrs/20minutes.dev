---
title: 'Build a Merkle Tree'
order: 45
lessons: 23
size: 'Small'
tech: ['Merkle trees', 'Inclusion proofs', 'Content addressing']
estMin: 20
desc: 'Build a Merkle tree with inclusion proofs, tamper detection, and tree diffing.'
blurb: 'A Merkle tree turns any list of data into one root hash you can trust: change a single byte anywhere and the root changes. Every lesson is one concrete spec with exact hashes, roots, and proofs. Uses a simple, hand-checkable FNV-1a hash instead of SHA-256 so every leaf hash, internal node, root, and proof is a pinned value you can reproduce - the tree structure is identical for any hash function.'
overview: |
  Over 23 lessons you build a working Merkle tree library from scratch: a tamper-evident structure that condenses a whole list of data into a single root hash. Change one byte of one item and the root changes; hand someone the root and a short proof and they can confirm an item belongs without seeing the rest of the data. This is the structure behind Git commits, Certificate Transparency logs, Bitcoin blocks, and peer-to-peer file sync.

  To keep every value exact and reproducible in any language, the project uses a simple deterministic hash - 32-bit FNV-1a rendered as eight hex digits - instead of a real cryptographic hash. Every leaf hash, internal node, root, and proof in the specs is a concrete number you can recompute by hand. You start with the hash itself and leaf-versus-internal domain separation (a 0x00 prefix for leaves, 0x01 for internal nodes, which blocks a classic forgery), build the tree by hashing all leaves and repeatedly pairing and hashing adjacent hashes up to a single root, handle an odd node at a level by promoting it, then use the root to detect tampering. On top of that you build inclusion (audit) proofs - an ordered list of sibling hashes that lets a verifier recompute the root from one leaf - and finish with an append-only consistency proof and a diff that walks two trees to report exactly which leaves changed. The capstone builds a tree over real data, proves and verifies membership, tampers with a leaf to show detection, and diffs two versions.

  This is a teaching-grade library, honest about its scope: it uses FNV-1a rather than SHA-256 (so it is a demonstration of structure, not real cryptographic security - the tree design is hash-agnostic and swapping in SHA-256 changes only the hash function), promotes lone nodes rather than duplicating them the way Bitcoin does, and diffs trees with the same number of leaves. It is exactly the honest core that production systems extend with a real hash, wider consistency proofs, and persistence.
parts:
  - name: 'Hashing and content addressing'
    count: 4
  - name: 'Building the tree'
    count: 5
  - name: 'Detecting tampering'
    count: 2
  - name: 'Inclusion proofs'
    count: 6
  - name: 'Consistency and diffing'
    count: 5
  - name: 'Capstone'
    count: 1
caveats:
  note: 'The library implements the core Merkle tree primitives (build, prove, verify, consistency, and diff) with graceful edge-case handling, but it intentionally uses a non-cryptographic 32-bit FNV-1a hash and supports only power-of-two consistency ranges and equal-leaf-count diffs, so it is teaching-grade rather than production-ready.'
  future:
    - 'Swap the 32-bit FNV-1a hash for SHA-256 (or another cryptographic hash) to make the tree genuinely collision-resistant instead of hand-checkable'
    - 'Add general consistency proofs for arbitrary old tree sizes, not just powers of two, in the Certificate Transparency (RFC 6962) style'
    - 'Support diffing trees with unequal leaf counts, for example detecting a pure append rather than refusing to compare'
    - 'Add serialization (JSON or binary) for a tree and a proof so proofs can cross a network and trees can persist between runs'
    - 'Add incremental updates so appending one leaf does not rebuild every level from scratch'
    - 'Add benchmarks and parallel leaf hashing for large datasets'
resources:
  - title: 'A Certified Digital Signature'
    author: 'Ralph C. Merkle'
    url: 'https://www.merkle.com/papers/Certified1979.pdf'
    note: 'The paper that introduced the hash tree. Merkle needed to authenticate many messages from one public value; the tree of hashes, with a short authentication path to the root, is the idea this whole project builds.'
  - title: 'RFC 6962: Certificate Transparency'
    author: 'Ben Laurie, Adam Langley, Emilia Kasper'
    url: 'https://datatracker.ietf.org/doc/html/rfc6962'
    note: 'The clearest practical spec of Merkle audit proofs (inclusion) and consistency proofs (append-only). Section 2 defines the exact tree-hashing and proof algorithms - including the 0x00 leaf and 0x01 node prefixes this project uses for domain separation.'
  - title: 'Bitcoin: A Peer-to-Peer Electronic Cash System'
    author: 'Satoshi Nakamoto'
    url: 'https://bitcoin.org/bitcoin.pdf'
    note: 'Section 7 (Reclaiming Disk Space) puts a Merkle root in each block header so a transaction can be proven present with a branch of the tree, without storing the whole block. Note Bitcoin duplicates a lone node where this project promotes it.'
  - title: 'Pro Git - Git Internals: Git Objects'
    author: 'Scott Chacon, Ben Straub'
    url: 'https://git-scm.com/book/en/v2/Git-Internals-Git-Objects'
    note: 'Content addressing in the wild: Git names every object by the hash of its content, so identical content collapses to one object and any change ripples up to a new commit hash. The same "same content, same hash" property leaf hashing gives you here.'
  - title: 'Efficient Data Structures for Tamper-Evident Logging'
    author: 'Scott A. Crosby, Dan S. Wallach'
    url: 'https://www.usenix.org/legacy/event/sec09/tech/full_papers/crosby.pdf'
    note: 'History trees generalize the append-only Merkle log: how to prove an old root is consistent with a new one after appends, which is the consistency-proof idea the diffing chapter sketches.'
---
