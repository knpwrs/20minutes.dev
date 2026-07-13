---
project: build-an-autocomplete-engine
lesson: 10
title: The edges of a completion query
overview: A completion query has two degenerate inputs a real typeahead hits constantly - an empty prefix and a prefix that matches nothing. Today you pin both, so the empty prefix returns everything and a miss returns a safe empty list, never an error.
goal: Return every word for an empty prefix, and a safe empty list for a prefix that matches nothing.
spec:
  scenario: Empty and unmatched prefixes behave safely
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Insert("car"), Insert("cat"), Insert("dog")'
    - kw: When
      text: 'Completions is queried at the edges'
    - kw: Then
      text: 'Completions("") returns exactly ["car", "cat", "dog"] (all words, equal to Words()), because an empty prefix lands find() on the root'
    - kw: And
      text: 'Completions("z") and Completions("cats") each return an empty list of length 0 (never nil, never an error) - one path missing at the first character, one running off the end of the tree'
code:
  lang: go
  source: |
    // No new code if lesson 8 is right - this lesson pins both edges.
    // Empty prefix: find("") never enters its loop, returns the root, so the
    //   walk covers the whole trie and Completions("") == Words().
    // Missing prefix: find returns nil, and Completions returns its initialized
    //   empty slice (out := []string{}). Confirm len == 0 for BOTH miss modes.
checkpoint: An empty prefix returns everything and a miss returns a safe empty list. Commit and stop here.
---

Two degenerate inputs bracket every completion query, and a good design absorbs
both without a special case. An **empty prefix** means "the user has typed nothing
yet": `find("")` walks zero characters and hands back the root, so the completion
walk runs over the entire trie and returns every word - `Completions("")` is just
`Words()`. That is what lets an empty search box show all its suggestions (ranked,
once we add weights).

A **missing prefix** is the opposite: nothing matches. It fails in two ways -
`Completions("z")` breaks at the very first character because the root has no `z`
child, and `Completions("cats")` walks `c-a-t` then finds no `s` and runs off the
end. Both make `find` return `nil`, and both must return the initialized **empty
list**, not an error and not a `nil` that panics when ranged over. Returning an
empty list is the right contract for a typeahead, where most intermediate
keystrokes match nothing and that is normal, not exceptional. With every edge of
the plain completion query pinned - a real prefix, the prefix-as-word, the empty
prefix, and the miss - the next chapter makes the list ranked.
