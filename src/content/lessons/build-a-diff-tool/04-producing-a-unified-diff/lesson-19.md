---
project: build-a-diff-tool
lesson: 19
title: The hunk range format
overview: A hunk header names the range of lines it touches on each side, like -1,5 or -0,0. There is one quirk worth its own lesson - a range of length one drops the count - so today you build and pin the range formatter.
goal: Format a (start, length) range as the string a unified diff header uses, omitting the length when it is 1.
spec:
  scenario: Ranges format with the length-one shorthand
  status: failing
  lines:
    - kw: Given
      text: 'a start line and a length'
    - kw: When
      text: 'formatRange formats them'
    - kw: Then
      text: 'formatRange(1, 5) is "1,5" and formatRange(9, 7) is "9,7"'
    - kw: And
      text: 'formatRange(2, 1) is "2" (a length of 1 drops the ",1"), while formatRange(0, 0) is "0,0"'
code:
  lang: go
  source: |
    func formatRange(start, length int) string {
      if length == 1 {
        return strconv.Itoa(start)
      }
      return fmt.Sprintf("%d,%d", start, length)
    }
checkpoint: You can format hunk ranges, including the length-one shorthand. Commit and stop here.
---

Each hunk header carries two ranges - the lines it covers in the old file and in the new - written as `start,length`. The one wrinkle in the unified format is that when a range covers exactly **one** line, the `,length` is omitted and only the start number is written: a single-line deletion reads `@@ -2 +2,0 @@`, not `@@ -2,1 +2,0 @@`. Tools like `patch` and `git apply` accept and produce this shorthand, so matching it keeps your output interoperable.

The other case to keep straight is a **zero-length** range, which happens for a pure insertion (no old lines) or pure deletion (no new lines): the length is written explicitly as `,0`, and the start is the line number just before the insertion or deletion point. So `formatRange(0, 0)` is `"0,0"`, used when inserting at the very top of a file. This tiny helper is pure formatting, but pinning its three cases now means the header assembly in the next lesson has nothing left to get wrong.
