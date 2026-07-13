---
project: build-a-sudoku-solver
lesson: 7
title: A set of digits
overview: The heart of a Sudoku solver is tracking which digits a cell could still hold - a set of digits per cell. Today you build that small set type with the four operations the rest of the project leans on.
goal: Build a set of digits 1 through 9 supporting membership, removal, size, and sole member.
spec:
  scenario: A digit set adds, removes, and reports its members
  status: failing
  lines:
    - kw: Given
      text: 'a full set of the digits 1 through 9'
    - kw: When
      text: 'its size is asked, then 3 and 5 are removed'
    - kw: Then
      text: 'the full set has size 9, and after removing 3 and 5 the size is 7 with 1 still a member and 3 no longer a member'
    - kw: And
      text: 'a set holding only 7 reports its sole member as 7, and removing every digit leaves size 0'
code:
  lang: go
  source: |
    // a set of 1..9; a bitmask (bit d set = d present) is compact and fast
    type Set uint16
    const Full Set = 0x3FE // bits 1..9 set
    func (s Set) Has(d int) bool { return s&(1<<uint(d)) != 0 }
    func (s Set) Remove(d int) Set { return s &^ (1 << uint(d)) }
    func (s Set) Size() int { /* count set bits 1..9 */ }
    func (s Set) Sole() int { /* the single member, when Size()==1 */ }
checkpoint: You have a digit set with membership, removal, size, and sole-member. Commit and stop here.
---

Everything from here on tracks **candidates** - the digits a cell could still take -
so you need a small, cheap set of the numbers 1 through 9. The four operations that
matter are: is a digit present, remove a digit, how many remain, and (when only one
remains) what is it. Those four cover both jobs ahead: computing what a blank can
hold, and driving propagation as options get eliminated.

A **bitmask** is the natural representation - one bit per digit - but the set is
defined by its behaviour, not its storage, so a list or a boolean array works just
as well. The two edges worth pinning today are the extremes: a full set has all 9
digits, and eliminating everything leaves an empty set of size 0. That empty set
will later be the solver's signal that it has hit a dead end.
