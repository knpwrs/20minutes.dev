---
project: build-a-type-checker
lesson: 32
title: Records
overview: Records are the last data shape - tuples with named fields instead of positions. Today you infer a record's type and read a field off it, closing the richer-types chapter with the most program-like structure yet.
goal: Infer a record's type from its fields, and type a field access against it.
spec:
  scenario: Constructing a record and reading a field
  status: failing
  lines:
    - kw: Given
      text: 'the record {name: "Ann", age: 30} and field accesses on records'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of {name: "Ann", age: 30} is {age: Int, name: String} (fields shown in name order), and accessing its age field is Int'
    - kw: And
      text: 'accessing a missing field, as in {age: 30}.name, fails with "record has no field: name"'
code:
  lang: go
  source: |
    type TRecord struct{ Fields map[string]Type }  // String: fields sorted by name
    type Record  struct{ Fields map[string]Expr }
    type Field   struct{ Record Expr; Name string }
    //   case *Record: infer each field's value (threading the substitution) into a TRecord.
    //   case *Field:
    //     rt, s, err := infer(env, f.Record)
    //     rec, ok := apply(s, rt).(TRecord)
    //     if !ok { return nil, nil, fmt.Errorf("not a record: %s", apply(s, rt)) }
    //     ft, ok := rec.Fields[f.Name]
    //     if !ok { return nil, nil, fmt.Errorf("record has no field: %s", f.Name) }
    //     return ft, s, nil
checkpoint: A record infers to a record type, and field access reads a field or reports a missing one. Commit and stop here.
---

A **record** is a tuple whose components are reached by **name** rather than
position: `{name: "Ann", age: 30}` has type `{age: Int, name: String}`. Inferring it
is like inferring a tuple - type each field's value and collect the results - with
the fields kept in a map keyed by name. Printing them in a fixed order, sorted by
name, matters more than it looks: a record type is the same type however its fields
were written, so `{age: Int, name: String}` and `{name: String, age: Int}` must read
back identically, and sorting guarantees that.

Field access reads one field's type off the record. This checker uses **exact**
record types - a record has precisely the fields it was built with - so accessing a
field simply looks it up, returning its type or reporting `record has no field: name`
when it is absent. That missing-field error is a genuine type error caught before the
program ever runs, the record analogue of an unbound variable. This deliberately
stops short of **row polymorphism** (a function like `\r. r.age` that works on *any*
record having an `age` field), which needs machinery beyond this project - a good
line to note in the caveats. With records done, the language is rich enough to write
real programs, and the final chapter turns to telling the programmer *where* a type
error is.
