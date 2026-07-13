---
project: build-a-btree-index
lesson: 39
title: Copy-on-write a page
overview: The heart of crash safety is one rule - never overwrite a live page. Today you implement copy-on-write for a single page, where a change writes a fresh copy to a newly allocated page and leaves the original byte-for-byte intact.
goal: Modify a page by copying it to a freshly allocated page and applying the change there, leaving the original page unchanged.
spec:
  scenario: A change lands on a fresh page
  status: failing
  lines:
    - kw: Given
      text: 'a live leaf at page 5 holding keys [10, 20]'
    - kw: When
      text: 'a copy-on-write update inserts key 30, allocating a new page for the result'
    - kw: Then
      text: 'the new page holds keys [10, 20, 30], and page 5 still holds exactly [10, 20] - not one byte of it changed'
    - kw: And
      text: 'the new page''s id comes from AllocPage (a freed or freshly extended page), never id 5'
code:
  lang: go
  source: |
    func cowPage(p Pager, id PageID, modify func(b []byte)) PageID {
      // take a defensive COPY - ReadPage may alias the live page buffer,
      // so mutating it directly would corrupt the original in place.
      buf := append([]byte(nil), p.ReadPage(id)...)
      modify(buf)               // change the copy only
      newID := p.AllocPage()
      p.WritePage(newID, buf)   // write the copy to a NEW page
      return newID              // the old page is left untouched
    }
checkpoint: A modified page goes to a fresh page; the original is left intact. Commit and stop here.
---

Every write until now overwrote pages **in place**, which is exactly what makes a
crash dangerous: interrupt an in-place update and the page is neither its old self
nor its new self. **Copy-on-write** removes that hazard by never touching a live
page. To change a page you read it, modify the *copy*, and write that copy to a
**newly allocated** page - the original stays exactly as it was, still reachable, still
valid.

This one rule is the foundation of the whole chapter. Because the old page survives
untouched, the previously committed tree remains fully intact no matter when a crash
strikes during the new write - the new pages are simply unreferenced until a commit
makes them official. The cost is writing new pages instead of reusing old ones, but
the payoff is atomicity: the change does not exist at all until you choose to
publish it. Next you apply this down a whole root-to-leaf path.
