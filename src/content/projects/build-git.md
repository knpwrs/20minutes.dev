---
title: 'Build Git'
order: 55
lessons: 41
size: 'Medium'
tech: ['Content-addressable storage', 'Merkle DAG', 'Version control']
estMin: 20
desc: 'Build the core of Git from first principles as a content-addressable object database. Start with the loose object format and blobs whose SHA-1 ids match real Git exactly, then build tree objects for directories, a staging index with write-tree, commit objects with parents and a fixed identity, refs and a symbolic HEAD with log, and a simplified status - ending in a working mini-git library whose objects real git cat-file can read.'
blurb: 'Every object id you compute matches real Git byte for byte, so you can cross-check with git hash-object and git cat-file at every step. Each lesson is one concrete spec with exact hex ids and byte layouts: the empty blob e69de29, hello.txt hashing to ce013625, a tree that sorts directories as if they end in a slash, a commit that reproduces its exact 40-hex id under a fixed author and timestamp, a symbolic HEAD resolving through a branch ref, and a two-commit log walking child to parent.'
overview: |
  Over 41 lessons you build the core of Git from first principles: a content-addressable object database in which every object is stored under the SHA-1 hash of its own contents. The remarkable payoff is that the ids you compute match real Git exactly, so at every step you can cross-check your work with git hash-object and git cat-file, and the objects your library writes can be read back by real git.

  You start with the loose object format and blobs, hashing file contents to the exact 40-hex ids Git produces. Then you build tree objects that encode directories (with the subtle rule that a directory sorts as if its name ended in a slash), a staging index and a write-tree that turns it into nested tree objects, commit objects that reproduce their exact id under a fixed author and timestamp, refs and a symbolic HEAD with a log that walks the parent chain, and a simplified status that classifies files as added, modified, or unchanged. The capstone runs a full session: initialise a repository, stage and commit a few files including one in a subdirectory, make a second commit, and assert every exact blob, tree, and commit id along with the branch ref and the log walk.

  This is a teaching-grade Git built around the object model, the Merkle DAG, and the index: a real library with a mini-git command line that stores into its own object directory. It deliberately stops short of the machinery real Git layers on top - it uses stdlib SHA-1 and zlib as plumbing rather than reimplementing them, has no packfiles or delta compression, no diff, merge, or network transport, a simplified index serialization, and a checkout that retargets HEAD rather than materialising the working tree. What it does build is the honest heart of Git: the object store, trees, the index, commits, refs, and the commit graph.
parts:
  - name: 'The object database and blobs'
    count: 7
  - name: 'Trees'
    count: 6
  - name: 'The index and write-tree'
    count: 7
  - name: 'Commits'
    count: 6
  - name: 'Refs, HEAD, and log'
    count: 8
  - name: 'Status and the capstone'
    count: 7
caveats:
  note: 'A genuinely working, teaching-grade Git core whose blob, tree, and commit ids match real Git byte for byte - so git cat-file can read the very objects it writes - with a content-addressable object store, nested trees, a staging index and write-tree, commits with parents, refs and a symbolic HEAD, log, branching, and a simplified status, all driven by a small reproducible mygit command line and demo; it stops at the plumbing layer, with no working-tree checkout, no diff or merge, no packfiles or delta compression, and no network transport.'
  future:
    - 'Materialize the working tree on checkout and reset - write and remove files so the on-disk tree matches the branch you switch to, including a detached-HEAD form'
    - 'Add a diff between two trees, or between a tree and the working tree, and use it to make status and a real mygit diff genuinely useful'
    - 'Implement merge: find the merge base, do a fast-forward and a naive three-way merge, and write conflict markers into the working files'
    - 'Replace the simplified line-based index with Git''s real binary index format, including cached stat data so status can skip re-hashing unchanged files'
    - 'Add packfiles and delta compression so many objects pack into a single file the way real Git stores accumulated history'
    - 'Add network transport (clone, fetch, and push over the pack protocol) along with lightweight and annotated tags'
resources:
  - title: 'Pro Git, Chapter 10: Git Internals'
    author: 'Scott Chacon, Ben Straub'
    url: 'https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain'
    note: 'The canonical explanation of Git as a content-addressable filesystem: loose objects, blobs, trees, commits, refs, and HEAD, worked through with the plumbing commands (hash-object, cat-file, write-tree, commit-tree) this project rebuilds.'
  - title: 'Building Git'
    author: 'James Coglan'
    url: 'https://shop.jcoglan.com/building-git/'
    note: 'A full book that reimplements Git from scratch in Ruby, object by object. The definitive long-form companion to this project, covering the exact loose-object, tree, and commit encodings, then going on to diffs, merges, and packs.'
  - title: 'Write Yourself a Git!'
    author: 'Thibault Polge'
    url: 'https://wyag.thb.lt/'
    note: 'A compact hands-on tutorial building a working git clone (wyag) in Python. Excellent, concise coverage of the object format, the fan-out storage layout, trees, refs, and the commit graph.'
  - title: 'gitformat-index and gitrepository-layout'
    author: 'Git documentation'
    url: 'https://git-scm.com/docs/gitformat-index'
    note: 'The official reference for the on-disk formats: the index (staging area) binary layout and the .git directory layout (objects, refs, HEAD). Read it to see how far real Git goes beyond the simplified index this project uses.'
  - title: 'Git from the Bottom Up'
    author: 'John Wiegley'
    url: 'https://jwiegley.github.io/git-from-the-bottom-up/'
    note: 'A classic essay that explains Git by starting at the object store and building up to branches and the reflog. The clearest short account of why blobs, trees, and commits are all just content-addressed objects.'
---
