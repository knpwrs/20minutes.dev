---
project: build-a-qr-code-encoder
lesson: 31
title: The eight mask patterns
overview: 'A raw data pattern can have large blank areas or runs that confuse a scanner, so QR flips modules in a regular pattern to break them up. There are eight such mask patterns; today you write all eight conditions and apply one to the data region.'
goal: 'Define the eight mask conditions and apply a mask by flipping data modules where its condition holds.'
spec:
  scenario: 'Masks flip only the data region'
  status: failing
  lines:
    - kw: Given
      text: 'the eight mask conditions indexed 0-7, each a formula over a module''s row and column'
    - kw: When
      text: 'the conditions are evaluated at sample coordinates'
    - kw: Then
      text: 'mask 0 ((row+col) mod 2 == 0) is true at (0,0) and false at (0,1); mask 1 (row mod 2 == 0) is true at (0,5) and false at (1,5); mask 6 (((row*col) mod 2 + (row*col) mod 3) == 0) is true at (2,3) and false at (5,3)'
    - kw: And
      text: 'applying a mask flips (dark to light and back) every data module whose condition is true, and never touches a function or reserved module'
code:
  lang: go
  source: |
    // Condition is true -> flip that data module.
    var masks = []func(r, c int) bool{
      func(r, c int) bool { return (r+c)%2 == 0 },
      func(r, c int) bool { return r%2 == 0 },
      func(r, c int) bool { return c%3 == 0 },
      func(r, c int) bool { return (r+c)%3 == 0 },
      func(r, c int) bool { return (r/2+c/3)%2 == 0 },
      func(r, c int) bool { return (r*c)%2+(r*c)%3 == 0 },
      func(r, c int) bool { return ((r*c)%2+(r*c)%3)%2 == 0 },
      func(r, c int) bool { return ((r+c)%2+(r*c)%3)%2 == 0 },
    }
checkpoint: 'You can apply any of the eight masks to the data region. Commit and stop here.'
---

The unmasked data grid is correct but often ugly: a stretch of zeros makes a big light patch, and a scanner can lose its place in it. A **mask** fixes this by flipping modules in a fixed geometric pattern, breaking up runs and balancing dark and light. There are exactly **eight** masks, numbered 0 to 7, each defined by a boolean condition over a module's coordinates. Where the condition is true, that module is inverted.

Crucially, a mask applies **only to data modules** - finder patterns, timing, the dark module, and the reserved format area are never masked, because their fixed shapes must survive. So `applyMask` walks the placeable modules only and flips those whose condition holds. Masking is reversible (flip twice and you are back), which is exactly how a scanner undoes it after reading the mask number from the format information. You do not pick a mask yet: the next four lessons build the scoring that decides which of the eight leaves the cleanest symbol.
