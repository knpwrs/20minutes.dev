---
project: build-a-url-parser
lesson: 2
title: Splitting off the scheme
overview: The scheme (http, mailto, ftp) is the first component and the one with the strictest grammar. Today you peel it off the front of the input, using the exact rule that decides whether a leading colon really marks a scheme or is just a character in the path.
goal: Detect and split a leading scheme, following the RFC 3986 scheme grammar.
spec:
  scenario: Detecting a scheme
  status: failing
  lines:
    - kw: Given
      text: 'the input "mailto:someone@example.com"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Scheme is "mailto" and Path is "someone@example.com"'
    - kw: And
      text: 'Parse("a/b:c") has an empty Scheme and Path "a/b:c", because the colon follows a slash'
code:
  lang: go
  source: |
    // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." ) ":"
    // find the ':' only if every char before it is legal AND
    // the first char is a letter. Any '/', '?', '#' first means no scheme.
    func schemeColon(s string) int {
      if len(s) == 0 || !isAlpha(s[0]) { return -1 }
      // scan until ':'; bail on the first non-scheme char
    }
checkpoint: Parse now separates a valid scheme from the rest of the URI. Commit and stop here.
---

The **scheme** names the URI's interpretation - `http`, `mailto`, `file` - and it always comes first, ending at the first colon. But not every colon starts a scheme: `a/b:c` is a relative path that happens to contain a colon, and treating `a/b` as a scheme would be wrong. RFC 3986 settles it with a precise grammar: a scheme is a letter followed by any number of letters, digits, and the three symbols `+`, `-`, and `.`, and then a colon. The key rule is that a `/`, `?`, or `#` appearing before the colon means there is no scheme at all - the colon belongs to a later component.

So scan from the start: the first character must be a letter, and every character up to the colon must be a legal scheme character. The moment you hit an illegal character (including a slash) you know there is no scheme and you leave the input untouched as a path. When you do find the terminating colon, everything after it is the rest of the URI, which you keep parsing in the coming lessons. Note the scheme is stored exactly as written; case-folding it to lowercase is a normalization step for later.
