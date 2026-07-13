---
project: build-a-btree-index
lesson: 35
title: A free list of recycled pages
overview: Deletes free pages, and a growing-only file would leak them. Today you add a free list - freed pages are pushed onto a stack threaded through the pages themselves, and AllocPage pops one before ever extending the file.
goal: Recycle freed pages via a free-list stack, so AllocPage reuses a freed page before extending the file.
spec:
  scenario: Reusing a freed page
  status: failing
  lines:
    - kw: Given
      text: 'a file pager that has allocated pages 1, 2, and 3'
    - kw: When
      text: 'FreePage(2) is called, then AllocPage'
    - kw: Then
      text: 'AllocPage returns 2 (the recycled page), not 4, and the page count does not grow'
    - kw: And
      text: 'a second AllocPage then returns 4 (the free list is empty again, so the file extends)'
code:
  lang: go
  source: |
    // free list is a stack threaded through the freed pages:
    // FreePage(id): write current freeHead into id's first 4 bytes;
    //   set freeHead = id.
    // AllocPage: if freeHead != 0 { id = freeHead;
    //   freeHead = getU32(ReadPage(id), 0); return id }  else extend.
checkpoint: Freed pages are recycled before the file grows. Commit and stop here.
---

A B+Tree frees pages constantly - every split abandons nothing, but every merge
frees a node, and a shrinking tree would bloat its file forever without reuse. The
**free list** fixes that: freed page ids form a stack, and the neat trick is that
the stack lives **inside the freed pages themselves**. Freeing a page writes the
current free-list head into that page's first four bytes and makes the page the new
head; allocating pops the head and follows the stored link to the next free page.

Because the free pages store the chain, the list costs no extra space - only the
`freeHead` pointer in the meta. `AllocPage` checks the free list first and only
extends the file when it is empty, so pages churn in place instead of the file
growing without bound. This is the same idea a real database's freelist uses, and it
is the last piece the on-disk pager needs before the tree can be opened and closed
as a persistent file.
