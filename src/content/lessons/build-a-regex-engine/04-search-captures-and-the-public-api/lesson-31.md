---
project: build-a-regex-engine
lesson: 31
title: Named capture groups
overview: Named groups let you pull a submatch out by name instead of counting parentheses. It is a small parser addition that makes patterns far more readable.
goal: Parse `(?P<name>...)` as a named group and expose the group names.
spec:
  scenario: Named groups are parsed and addressable by name
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "(?P<word>[a-z]+)"'
    - kw: When
      text: it is compiled and its group names are read
    - kw: Then
      text: 'SubexpNames returns ["", "word"] - group 0 is unnamed'
    - kw: And
      text: 'for the pattern "(?P<y>[0-9]+)-(?P<m>[0-9]+)", SubexpIndex of "m" returns 2'
    - kw: And
      text: 'FindStringSubmatch of that pattern against "2026-07" returns ["2026-07", "2026", "07"]'
code:
  lang: go
  source: |
    // After '(', peek for the "?P<" prefix. If present, read the name
    // up to '>', then parse the group body as usual.
    // Keep a names slice parallel to the groups: names[0] = "",
    // names[i] = that group's name (or "" if unnamed).
    // SubexpIndex(name) scans names for a match.
checkpoint: '`(?P<name>...)` groups are parsed and addressable by name via SubexpNames and SubexpIndex. Commit and stop here.'
---

Counting parentheses to find "group 2" is brittle - insert a group earlier and every
number shifts. **Named groups** fix that: `(?P<year>[0-9]+)` captures exactly like a
numbered group but also carries the label `year`. The parsing change is small: right
after `(`, check for the `?P<` prefix, read the name up to `>`, and then parse the group
body exactly as before. A named group is still a normal capture group underneath.

Store the names in a slice that runs parallel to the group numbers, with `names[0]`
empty for the whole-match slot. `SubexpNames` hands that slice back, and `SubexpIndex`
turns a name into its group number so callers can look up `submatch[idx]`. This is the
same design Go's `regexp` uses, and it is what makes the final chapter's date-parsing
example read cleanly - you ask for the `year` group, not "group 1".
