---
project: build-a-text-editor
lesson: 23
title: Expanding tabs
overview: A tab is one byte in the buffer but jumps several columns on screen. Today you expand tabs to the next tab stop when rendering, and compute the screen column of any position on a line.
goal: Expand tabs to the next multiple of the tab width when rendering, and map a buffer column to its screen column.
spec:
  scenario: Tabs expand to the next tab stop
  status: failing
  lines:
    - kw: Given
      text: a tab width of 8
    - kw: When
      text: a line containing tabs is expanded and a column is mapped
    - kw: Then
      text: 'expandTabs("a\tb") is "a       b" (an "a", seven spaces filling to column 8, then "b"), and expandTabs("\t") is eight spaces'
    - kw: And
      text: 'renderColumn("ab\tc", 3) is 8 (the "c" sits at screen column 8, because "ab" plus a tab fills columns 0 through 7)'
code:
  lang: go
  source: |
    const TabWidth = 8
    // walk the line; on a tab, advance the screen column to the next
    // multiple of TabWidth by emitting that many spaces:
    //   next := col + (TabWidth - col%TabWidth)
    // renderColumn maps a buffer index to its expanded screen column
checkpoint: Tabs expand to tab stops and screen columns are known. Commit and stop here.
---

A tab is not "some fixed number of spaces" - it advances to the **next tab stop**,
the next multiple of the tab width. Expanding `"a\tb"` with a width of 8 puts `a` at
column 0, then the tab fills columns 1 through 7 with spaces so the next character
lands exactly on column 8, giving `"a"` + seven spaces + `"b"`. A tab at the very
start jumps a full eight columns. The formula for how far a tab reaches from the
current column is `width - col%width`.

This splits the idea of a "column" into two. The **buffer column** is an index into
the line's bytes; the **screen column** is where that byte actually appears once
tabs are expanded. `renderColumn` maps one to the other by walking the line and
counting expanded width up to the target index. Rendering uses the expanded line so
tabs display as alignment; horizontal scrolling and, next lesson, the on-screen
cursor use the screen column so they land in the right visual spot. Getting this
mapping right is what keeps the cursor glued to the character it is really on.
