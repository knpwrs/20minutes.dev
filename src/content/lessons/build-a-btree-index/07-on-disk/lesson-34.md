---
project: build-a-btree-index
lesson: 34
title: Allocating pages on disk
overview: On disk, a fresh page comes from growing the file. Today you make the file pager's AllocPage hand out the next page by extending the file, keeping page 0 reserved for the meta and tracking the page count.
goal: Allocate a new page by extending the file, returning increasing ids starting after the reserved meta page.
spec:
  scenario: Growing the file for new pages
  status: failing
  lines:
    - kw: Given
      text: 'a fresh file-backed tree file (page 0 is the meta, page count 1)'
    - kw: When
      text: 'AllocPage is called twice'
    - kw: Then
      text: 'it returns page ids 1 then 2 - never 0, which is reserved for the meta'
    - kw: And
      text: 'the page count becomes 3, and the file is large enough to hold pages 0 through 2 (at least 3 * 4096 bytes)'
code:
  lang: go
  source: |
    func (p *filePager) AllocPage() PageID {
      // if the free list is non-empty, reuse (next lesson); else:
      id := p.pageCount        // next id past the end
      p.pageCount++
      // ensure the file is at least pageCount*PageSize bytes
      return id
    }
checkpoint: New pages come from extending the file, with page 0 held for the meta. Commit and stop here.
---

Allocation on disk is growth: the next page is the one just past the current end of
the file, so `AllocPage` returns the current page count and bumps it. Page 0 is
always the meta, so a brand-new file starts with a page count of 1 and the first
node lands at id 1. Keeping the count in the pager (and, on the meta page, on disk)
means a reopened file knows exactly where its used region ends.

Growing forever would waste space as keys are deleted, which is why the next lesson
adds a **free list**: freed pages get recycled before the file is extended again.
For now, allocation is the simplest thing that can work - bump a counter, make sure
the file is big enough - and it is enough to run the whole tree on disk. The
recycling is a pure optimization layered on top, using the free-list head the meta
page already reserves.
