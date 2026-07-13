---
project: build-a-glob-matcher
lesson: 14
title: Trailing spaces and escaped markers
overview: 'Two small parsing rules keep gitignore honest: trailing spaces are stripped unless a backslash protects one, and a backslash lets a line begin with a literal hash or bang. Today Compile handles both so a pattern is exactly what was meant.'
goal: 'Strip trailing spaces unless escaped, and unescape a leading hash or bang.'
spec:
  scenario: Whitespace and leading-marker escapes are normalized
  status: failing
  lines:
    - kw: Given
      text: 'lines with trailing spaces or an escaped leading marker'
    - kw: When
      text: 'Compile normalizes each line'
    - kw: Then
      text: 'trailing spaces are stripped: the line "foo   " compiles to the pattern "foo"'
    - kw: And
      text: 'a backslash keeps one trailing space and escapes a leading marker: "foo\ " keeps the pattern "foo " and "\#foo" is the literal pattern "#foo", not a comment'
code:
  lang: go
  source: |
    // strip trailing spaces unless the last one is escaped
    if strings.HasSuffix(line, "\\ ") {
      line = line[:len(line)-2] + " "
    } else {
      line = strings.TrimRight(line, " ")
    }
    if line == "" || line[0] == '#' { continue }   // blank / real comment
    if strings.HasPrefix(line, "\\#") || strings.HasPrefix(line, "\\!") {
      line = line[1:]   // a literal '#' or '!' start; drop the backslash
    }
checkpoint: 'Compile normalizes trailing spaces and escaped leading markers. Commit and stop here.'
---

Git treats a `.gitignore` as slightly more than raw lines. **Trailing spaces** are
usually accidental, so they are stripped - `foo   ` means the pattern `foo`. But a
filename really can end in a space, so a **backslash** before a trailing space
protects it: `foo\ ` is the pattern `foo ` with the space kept. The backslash is
consumed; the space stays.

The other escape is at the front. A leading `#` marks a comment and a leading `!`
marks negation (next lesson), so to match a file that genuinely starts with one of
those, you escape it: `\#foo` is the literal pattern `#foo`, and `\!foo` the literal
`!foo`. The ordering in `Compile` matters - normalize trailing space first, then
skip a blank or a **real** comment (one whose first character is an unescaped `#`),
and only then strip an escaping backslash off a leading marker. Handling both here
means every downstream rule sees a clean, exact pattern.
