---
project: build-a-skip-list
lesson: 2
title: The list and its head sentinel
overview: A skip list needs an entry point that is always present even when the list is empty. Today you build the list around a head sentinel - a node with a full-height tower whose pointers are the starting rungs of every level - and confirm a fresh list is empty.
goal: Create a skip list with a full-height head sentinel, a current level of 1, and a length of 0.
spec:
  scenario: A fresh skip list is empty and starts at level 1
  status: failing
  lines:
    - kw: Given
      text: 'a skip list created with NewSkipList(1), where the maximum level is 4'
    - kw: When
      text: 'its length and current level are queried'
    - kw: Then
      text: 'Len is 0 and Level is 1'
    - kw: And
      text: "the head sentinel's tower has 4 levels (the maximum), all pointers empty"
code:
  lang: go
  source: |
    const MaxLevel = 4
    type SkipList struct {
      head   *node  // sentinel; its forward pointers are the head of each level
      level  int    // highest level currently in use, 1..MaxLevel
      length int
      seed   uint32 // used later to drive random tower heights
    }
    func NewSkipList(seed uint32) *SkipList {
      return &SkipList{head: newNode(0, 0, MaxLevel), level: 1, seed: seed}
    }
    func (s *SkipList) Len() int   { return s.length }
    func (s *SkipList) Level() int { return s.level }
checkpoint: You have an empty skip list with a full-height head sentinel. Commit and stop here.
---

Search and insertion always begin at the same place: a **head sentinel**. It is a
node that holds no real key or value; it exists only so that `head.forward[i]` is
the first node on level `i`. Because a node might one day be as tall as the list is
allowed to get, the sentinel is created at the **maximum** height - here a fixed
`MaxLevel` of 4 - so there is always a rung to stand on at every level. A small
fixed cap keeps our examples hand-checkable; a production list would raise the cap
as it grows.

The list also tracks its **current level**: the height of the tallest tower in it
so far, which starts at 1 for an empty list (only the bottom level is in use) and
never exceeds `MaxLevel`. Searches start at this current level, not the maximum, so
they never waste steps on empty express lanes. Store the `seed` now too; it will
drive the random tower heights a few lessons from now, but the list needs somewhere
to keep it from the start.
