---
project: build-a-json-parser
lesson: 32
title: Resolving a pointer against a value
overview: With a pointer parsed into tokens, resolving it means walking the value tree one step at a time. Today you follow the tokens into objects and arrays and report a clean error when a step has nowhere to go.
goal: Resolve a JSON Pointer against a value, returning the referenced value or an error.
spec:
  scenario: Walking a pointer into a document
  status: failing
  lines:
    - kw: Given
      text: 'the value parsed from {"a":[10,20]}'
    - kw: When
      text: 'Resolve is called with a pointer'
    - kw: Then
      text: 'Resolve with "/a/1" returns Number 20, and Resolve with the empty pointer returns the whole document'
    - kw: And
      text: 'Resolve with "/x" is an error (no such member) and Resolve with "/a/5" is an error (index out of range)'
code:
  lang: go
  source: |
    // Resolve(doc Value, pointer string) (Value, error)
    //   parse the pointer to tokens; start cur = doc
    //   for each token:
    //     Object -> find the member whose Key == token, else error
    //     Array  -> token must be a base-10 index in range, else error
    //     scalar -> error: cannot descend
    //   return cur
checkpoint: JSON Pointers resolve to values, with clear errors for bad paths. Commit and stop here.
---

Resolution is the second half of a pointer lookup: start at the document and, for
each **reference token**, take one step deeper. If the current value is an object,
the token is a **key** and you find the member with that exact name. If it is an
array, the token is an **index** - a base-10 number - and you select that element.
The empty pointer takes no steps and returns the whole document.

Every step can fail, and a good query layer says so rather than returning a bogus
value. A key that no member has, an index past the end of an array, an index token
that is not a number, or a token that tries to descend into a scalar - each is an
error naming what went wrong. Pin a successful walk (`/a/1` reaching `20`) against
the failing ones (`/x` and `/a/5`) so both the happy path and the guards are proven.
With `Resolve`, the library can now build a tree, print it, and query it - everything
the capstone needs.
