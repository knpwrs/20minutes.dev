---
project: build-a-json-parser
lesson: 30
title: Parsing a JSON Pointer
overview: Having a value tree is useful; reaching into it by a path is what makes it queryable. Today you parse a JSON Pointer string into its sequence of reference tokens, the first half of a lookup.
goal: Split a JSON Pointer string into its reference tokens.
spec:
  scenario: Splitting a pointer into tokens
  status: failing
  lines:
    - kw: Given
      text: 'a JSON Pointer string'
    - kw: When
      text: 'ParsePointer is called'
    - kw: Then
      text: 'ParsePointer("/a/b/0") is the tokens a, b, 0; ParsePointer("") is no tokens (the whole document); and ParsePointer("/") is a single empty-string token'
    - kw: And
      text: 'a non-empty pointer that does not begin with a slash, like ParsePointer("a"), is an error'
code:
  lang: go
  source: |
    // ParsePointer(p string) ([]string, error)
    //   "" -> [] (refers to the whole document)
    //   must start with '/', else error
    //   split the rest on '/': each piece is one reference token
    //     "/" -> [""]; "/a/b/0" -> ["a","b","0"]; "/a/" -> ["a",""]
checkpoint: A JSON Pointer parses into reference tokens. Commit and stop here.
---

A **JSON Pointer** (RFC 6901) is a compact path into a document, written as a run of
slash-separated steps like `/a/b/0`. It is the query syntax this library exposes:
give it a pointer and it walks the value tree to the referenced value. The first step
is purely lexical - split the pointer string into its **reference tokens**, one per
step, before any tree is involved.

The rules are small but exact. The empty string is a valid pointer that refers to
the **whole document**, so it yields zero tokens. A non-empty pointer must begin with
a slash; the tokens are then whatever lies between the slashes, so `/a/b/0` gives
three tokens and a lone `/` gives one **empty** token (the key that is the empty
string, which JSON allows). A pointer that does not start with a slash is malformed.
One wrinkle remains: a token can contain a literal slash or tilde via an escape, and
decoding those is the next lesson.
