---
project: build-a-diff-tool
lesson: 1
title: Splitting text into lines
overview: A diff tool compares two documents line by line, so the very first thing we need is a way to turn a blob of text into a sequence of lines. Today you build that splitter - the input to everything that follows.
goal: Split a text string into a sequence of lines, dropping the empty trailing element a final newline leaves behind.
spec:
  scenario: Text becomes a clean sequence of lines
  status: failing
  lines:
    - kw: Given
      text: 'the text "a\nb\nc\n"'
    - kw: When
      text: 'Lines is called on it'
    - kw: Then
      text: 'it returns the three lines ["a", "b", "c"] (the trailing newline does not add a fourth empty line)'
    - kw: And
      text: 'Lines("a\nb") also returns ["a", "b"], and Lines("") returns an empty sequence'
code:
  lang: go
  source: |
    func Lines(text string) []string {
      if text == "" {
        return []string{}
      }
      parts := strings.Split(text, "\n")
      // a trailing newline leaves a final "" element - drop it
      if len(parts) > 0 && parts[len(parts)-1] == "" {
        parts = parts[:len(parts)-1]
      }
      return parts
    }
checkpoint: You can turn any document into the sequence of lines the diff will compare. Commit and stop here.
---

Every diff you have ever read is line-based: it talks about lines added, lines removed, lines kept. So the atom of our whole library is the **line**, and the first job is to chop a document into an ordered sequence of them. From here on, "a document" means a `[]string` of lines, and every algorithm we build compares two such sequences.

The one subtlety is the **trailing newline**. A well-formed text file usually ends with `\n`, and naively splitting `"a\nb\nc\n"` on `\n` yields a phantom empty string at the end. We drop that trailing empty element so `"a\nb\nc\n"` is three lines, not four. A document that does *not* end in a newline (like `"a\nb"`) keeps its last line as-is. We are throwing away the information about whether the file ended in a newline for now - a later lesson brings it back when it matters for output.
