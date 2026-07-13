---
project: build-a-shell
lesson: 18
title: Tilde expansion
overview: A leading `~` is shorthand for your home directory. Today you add tilde expansion, a small rewrite that happens before a word is used as a path.
goal: Expand a leading `~` in a word to the value of HOME; leave a tilde elsewhere in the word untouched.
spec:
  scenario: Expanding a leading tilde
  status: failing
  lines:
    - kw: Given
      text: 'HOME is "/home/me"'
    - kw: When
      text: 'the word "~/docs" is expanded'
    - kw: Then
      text: 'it becomes "/home/me/docs"'
    - kw: And
      text: 'a tilde that is not at the start of a word, like "a~b", is left unchanged'
code:
  lang: c
  source: |
    // only a tilde at position 0 of an unquoted word expands
    if (word[0] == '~' && (word[1] == '\0' || word[1] == '/')) {
        char *home = var_get(vars, "HOME");
        // result = home + (word + 1)
    }
checkpoint: '`cd ~/projects` and `ls ~` work. Commit and stop here.'
---

The **tilde** is the shell's shorthand for your home directory, so `~` on its own
means `/home/me` and `~/docs` means `/home/me/docs`. It is what lets you type
`cd ~/projects` instead of spelling out the full path. Expansion replaces a
**leading** `~` with the value of `HOME`, keeping whatever path follows.

The rule is deliberately narrow: the tilde only expands when it is the **first
character of a word** and is followed by a `/` or nothing at all. A tilde in the
middle of a word - `a~b`, an email address, a backup filename - is an ordinary
character and stays put. (Real shells also expand `~user` to that user's home
directory by looking it up in the password database; the plain `~` form is the one
you reach for daily, and the one today's spec pins down.)
