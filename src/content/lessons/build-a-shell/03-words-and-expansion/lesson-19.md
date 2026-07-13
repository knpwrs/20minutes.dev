---
project: build-a-shell
lesson: 19
title: Globbing with * and ?
overview: When you type `*.txt`, the shell - not the program - turns it into the list of matching filenames. Today you implement that filename expansion for the `*` and `?` wildcards.
goal: Expand a word containing `*` or `?` into the sorted list of matching filenames in the current directory.
spec:
  scenario: Expanding wildcard patterns
  status: failing
  lines:
    - kw: Given
      text: 'the current directory contains the files "a.txt", "ab.txt", and "b.md"'
    - kw: When
      text: 'the word "*.txt" is expanded'
    - kw: Then
      text: 'it becomes ["a.txt", "ab.txt"] in sorted order'
    - kw: And
      text: 'the word "?.txt" becomes ["a.txt"] (? matches exactly one character)'
code:
  lang: c
  source: |
    // match(pattern, name): '*' matches any run, '?' matches one char
    // then scan the directory and keep names that match, sorted
    for each entry in readdir(".")
        if (entry[0] != '.' && match(pattern, entry))   // skip dotfiles
            add(results, entry);
    sort(results);
checkpoint: '`echo *.txt` lists your text files. Commit and stop here.'
---

Here is a surprise for most people: when you run `rm *.txt`, the `rm` program
never sees the `*`. The **shell** expands `*.txt` into the actual list of matching
filenames first, then hands `rm` that list. This is **globbing**, and it means
every program gets wildcard support for free without knowing wildcards exist.

Two wildcards today. `*` matches any run of characters (including none), and `?`
matches exactly one character. To expand a pattern, scan the current directory and
keep every filename the pattern matches, then sort the results - shells return
glob matches in sorted order so output is predictable. One conventional rule:
files whose names begin with `.` are hidden and are **not** matched by a leading
`*` or `?`, which is why `*` does not sweep up `.git`. A small recursive matcher
handles both wildcards cleanly.
