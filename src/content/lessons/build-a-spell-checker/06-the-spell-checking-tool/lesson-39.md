---
project: build-a-spell-checker
lesson: 39
title: A personal ignore list
overview: Every user has words the dictionary lacks - names, jargon, project terms. Today you add a personal ignore list so the checker accepts words you mark, and stops flagging them.
goal: Let the checker accept explicitly ignored words as correct, so they are never flagged.
spec:
  scenario: Ignored words are treated as known
  status: failing
  lines:
    - kw: Given
      text: 'a Checker over a dictionary containing "the", where Ignore("Zaphod") has been called'
    - kw: When
      text: 'Check("Zaphod teh") is called'
    - kw: Then
      text: 'it returns one Issue, for "teh" - "Zaphod" is accepted and not flagged'
    - kw: And
      text: 'ignoring is case-insensitive, so "zaphod" and "ZAPHOD" are also accepted'
code:
  lang: go
  source: |
    func (c *Checker) Ignore(word string) {
      // remember normalize(word) in a personal set
    }
    // a token is skipped if the dictionary Contains it OR it is ignored
checkpoint: The checker honors a personal ignore list of accepted words. Commit and stop here.
---

No fixed dictionary fits every document - a novel has invented names, a codebase has
identifiers, a field has jargon. Rather than force those into the main dictionary, a
spell checker keeps a **personal ignore list**: words the user has marked as fine.
`Ignore("Zaphod")` records the name, and from then on the checker treats it exactly
like a known word - no flag, no suggestions.

The implementation reuses the same normalization as the dictionary, so ignoring is
**case-insensitive**: mark `Zaphod` once and `zaphod` and `ZAPHOD` are all accepted.
Conceptually the checkable test now has three outs - a token is left alone if it is
an acronym, if the dictionary contains it, or if it has been ignored - and only what
survives all three is flagged. This is the last feature the tool needs; the capstone
puts everything together on a real passage.
