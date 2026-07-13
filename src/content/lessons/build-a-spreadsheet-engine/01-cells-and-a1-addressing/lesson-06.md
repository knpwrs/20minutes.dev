---
project: build-a-spreadsheet-engine
lesson: 6
title: The sheet grid
overview: A spreadsheet is a grid of cells you can write to and read from by address. Today you build that grid so literal values can be stored at an A1 address and read back, with any address you never set reading as empty.
goal: Store literal values at A1 addresses and read them back, defaulting to Empty for anything unset.
spec:
  scenario: The sheet stores and returns cell values
  status: failing
  lines:
    - kw: Given
      text: 'a new empty sheet'
    - kw: When
      text: 'SetNumber("A1", 5) and SetText("B2", "hi") are called and cells are read back'
    - kw: Then
      text: 'Get("A1") is the Number 5 and Get("B2") is the Text "hi"'
    - kw: And
      text: 'Get("C3"), never set, is the Empty value'
code:
  lang: go
  source: |
    type Sheet struct{ cells map[Ref]Value }
    func NewSheet() *Sheet { return &Sheet{cells: map[Ref]Value{}} }
    func (s *Sheet) SetNumber(a string, n float64) {
      s.cells[parseRef(a)] = Value{Kind: Number, Num: n}
    }
    func (s *Sheet) Get(a string) Value {
      v, ok := s.cells[parseRef(a)]
      if !ok { return Value{Kind: Empty} }
      return v
    }
checkpoint: The sheet stores literals by address and returns Empty for anything unset. Commit and stop here.
---

Now the addressing work pays off: a **sheet** is just a map from a cell coordinate
to its value. Writing a cell parses the A1 address to a `Ref` and stores the value;
reading a cell parses the address and looks it up. Because the store is sparse - we
only keep cells that were actually set - any address you have never written reads
back as the `Empty` value rather than an error or a zero.

That "unset means Empty" rule matters more than it looks. Real spreadsheets are
mostly blank, and formulas routinely reference cells that hold nothing yet; treating
an unset cell as `Empty` (which arithmetic will later read as zero) is what lets a
formula like `=A1+B1` work before you have filled in `B1`. Today the sheet only
holds literals you set directly; next lesson it learns to tell a literal apart from
a formula.
