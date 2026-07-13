---
project: build-a-json-parser
lesson: 13
title: A value tree and parsing a scalar
overview: With tokens in hand, the parser's job is to build a tree of values. Today you define that value type and parse the four scalar tokens - null, boolean, number, string - into it, giving the library its public Parse entry point.
goal: Define the Value type and parse a single scalar token into the matching value.
spec:
  scenario: Parsing a lone scalar
  status: failing
  lines:
    - kw: Given
      text: 'an input holding a single scalar token'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse("null") is a Null value, Parse("true") is Bool true, Parse("42") is Number 42, and Parse a quoted hi is String hi'
    - kw: And
      text: 'Parse returns a value and a nil error for each of these'
code:
  lang: go
  source: |
    // name the value's kind apart from the scanner's token Kind
    // (same package), or the two collide
    type ValueKind int
    const ( KindNull ValueKind = iota; KindBool; KindNumber
            KindString; KindArray; KindObject )
    type Member struct { Key string; Value Value }
    type Value struct {
      Kind ValueKind
      Bool bool; Num float64; Str string
      Arr []Value; Obj []Member
    }
    // ParseError carries position; Parse scans then reads one value
    type ParseError struct { Offset, Line, Col int; Msg string }
    func Parse(input string) (Value, error) { /* scan, parseValue */ }
checkpoint: Parse turns a single scalar into a typed Value. Commit and stop here.
---

The scanner produced a flat stream of tokens; the **parser** turns that stream into
a tree. The tree's node type is `Value` - a tagged union whose `Kind` says which of
the six JSON types it holds, with a field for each payload: a bool, a number, a
string, a slice of child values for arrays, and a slice of key/value members for
objects. Every JSON document parses into exactly one `Value`.

Start at the leaves. The four **scalar** tokens each map straight to a value: a Null
token to a Null value, True/False to a Bool, a Number token to a Number value
carrying its `Num`, a String token to a String value carrying its `Str`. This is
also where the public `Parse` function is born: it scans the input, reads one value,
and returns it. Give it a `ParseError` type carrying a position now, even though the
scalars all succeed - the error chapter will lean on it, and arrays and objects,
which recurse back into this same value-reading step, come next.
