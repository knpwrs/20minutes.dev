---
project: build-a-fuzzy-finder
lesson: 26
title: Picking one
overview: The whole point of a finder is to pick something. Today you add accept - the operation that returns the currently selected candidate, the value a user commits to by pressing Enter.
goal: Return the selected candidate, and signal cleanly when there is nothing to accept.
spec:
  scenario: Accepting the selection
  status: failing
  lines:
    - kw: Given
      text: 'a Finder whose results are ["src/app.go", "src/main.go", "go.mod"]'
    - kw: When
      text: 'accept is called with the selection at index 1, then with the selection at index 0, then on a Finder with no results'
    - kw: Then
      text: 'at index 1 it returns "src/main.go", at index 0 it returns "src/app.go", and with no results it signals "nothing selected" (an ok flag of false), never indexing off the end'
code:
  lang: go
  source: |
    // Return the selected candidate plus an ok flag, mirroring the
    // found-or-not pattern from matching.
    func (f *Finder) Accept() (string, bool) {
      if len(f.Results) == 0 { return "", false }
      return f.Results[f.Selection].Candidate, true
    }
checkpoint: The finder can return the candidate the user chose. Commit and stop here.
---

**Accept** is the finder's output. Every earlier operation exists to get the right candidate under the cursor; accept is where that candidate leaves the finder and becomes the answer - the path you cd into, the file you open, the branch you check out. It reads the selected result and returns its candidate.

The edge that matters is an **empty** result list: with nothing matching, there is nothing to accept, so accept must say so rather than index into an empty slice and crash. Returning a value plus an **ok flag** is the same "missing is its own answer" shape the matcher used back in lesson two - a clean signal the caller can branch on. With movement and accept in place, the finder model is functionally complete; what remains is drawing it and feeding it keystrokes.
