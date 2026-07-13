---
project: build-a-sql-database
lesson: 1
title: A typed value
overview: A database stores more than numbers - it stores integers, text, and the absence of a value. Today you build the single tagged value type that every row, expression, and result in the engine is made of.
goal: Represent an integer, a text, and a null value in one type, and compare two values for equality.
spec:
  scenario: Comparing typed values
  status: failing
  lines:
    - kw: Given
      text: 'an integer value 42 and a text value "42"'
    - kw: When
      text: the two values are compared for equality
    - kw: Then
      text: they are not equal (different types)
    - kw: And
      text: two integer values 42 are equal
    - kw: And
      text: a null value equals another null value, and equals no integer or text
code:
  lang: go
  source: |
    // one value, three shapes: tag says which
    type Kind int
    const ( KindInt Kind = iota; KindText; KindNull )
    type Value struct { Kind Kind; Int int64; Text string }
    // Equal compares Kind first, then the matching payload
checkpoint: You have a Value that holds an integer, text, or null and knows when two values are equal. Commit and stop here.
---

Every cell in a table holds a **value**, and a value carries a **type** - an
integer, a string of text, or `NULL`, the explicit absence of data. The trick
that makes the rest of the engine simple is representing all three with one type
that tags which shape it currently holds, so a row is just a list of these and
nothing downstream has to special-case "what kind of thing is this."

Equality is where the type tag earns its keep: the integer `42` and the text
`"42"` print the same but are **not** the same value, because comparing them must
check the kind before the contents. Get this one comparison right and filtering,
joining, and grouping all inherit it for free later.
