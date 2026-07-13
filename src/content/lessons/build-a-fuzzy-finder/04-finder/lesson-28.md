---
project: build-a-fuzzy-finder
lesson: 28
title: Drawing a frame
overview: The finder finally becomes something you can look at. Today you render its state to a text frame - a header with the query and match count, then the top results with the selected one marked and matches highlighted.
goal: Render the finder's state as a frame - a header line plus up to a given number of result rows, marking the selection and highlighting matches.
spec:
  scenario: Rendering a finder frame
  status: failing
  lines:
    - kw: Given
      text: 'a Finder over ["src/main.go", "README.md", "go.mod", "src/app.go"] with query "go", selection 0, rendered at height 3'
    - kw: When
      text: render produces the frame
    - kw: Then
      text: 'the frame is these four lines joined by newlines: "> go [3/4]" (header: prompt, query, matched-over-total), then "> src/app.[g][o]" (selected row, marked with "> "), then "  src/main.[g][o]", then "  [g][o].mod"'
code:
  lang: go
  source: |
    // Line 1: "> " + query + " [" + matched + "/" + total + "]"
    // Then up to `height` result rows: the selected row is prefixed "> ",
    // others "  "; each candidate is highlight()-ed.
    func (f *Finder) Render(height int) string {
      // header, then topK(f.Results, height) rows with markers + highlight
    }
checkpoint: The finder renders a readable, highlighted frame of its current state. Commit and stop here.
---

A frame is the finder made visible. It has two parts: a **header** showing the prompt, the current query, and how many candidates matched out of the total; and the **rows**, the top results (capped at the display height) with each match highlighted the way chapter one drew them. The **selected** row gets a marker - here `> ` - so the user can see where the cursor is.

Rendering to a plain string keeps this exactly testable and completely decoupled from any terminal: the same frame logic drives a real screen later just by swapping the markers for cursor moves and the brackets for reverse-video. This reuses everything - `topK` to cap the rows, `highlight` to light up matches, the selection index to place the marker. The count in the header, `matched/total`, is the small touch that tells the user how much the query has narrowed things, and it becomes important the moment a query matches nothing.
