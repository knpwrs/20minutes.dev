---
project: build-a-toml-parser
lesson: 5
title: Bare and quoted keys
overview: 'A key is not always a simple word. Today you support the full bare-key character set and the two quoted key forms, so a key can hold dots, spaces, or any character a string can.'
goal: 'Parse bare keys over the full character set and both quoted key forms.'
spec:
  scenario: The three ways to write a key
  status: failing
  lines:
    - kw: Given
      text: 'the bare key a-b_2, the basic quoted key written "127.0.0.1", and the literal quoted key written in single quotes as key two'
    - kw: When
      text: 'each is used on the left of a pair set to the integer 1'
    - kw: Then
      text: 'the stored keys are exactly a-b_2, then 127.0.0.1, then the two-word text key two'
    - kw: And
      text: 'a bare key allows only ASCII letters, digits, underscore, and hyphen, so the key names keep those characters verbatim'
code:
  lang: go
  source: |
    // parse the key text on the left of '=':
    //   if it starts with '"'  -> read a basic-string key (quotes stripped)
    //   if it starts with '\'' -> read a literal-string key (quotes stripped)
    //   otherwise it is a bare key: A-Za-z0-9_- only
    // the stored key is the text WITHOUT the surrounding quotes
checkpoint: 'Keys can be bare, basic-quoted, or literal-quoted. Commit and stop here.'
---

A **bare key** is the common case, and TOML restricts it to a tidy set: ASCII
letters, digits, underscore, and hyphen (`A-Za-z0-9_-`). That is enough for names
like `server`, `user_id`, or `a-b_2`, and pinning the full set now means a later
document with a hyphenated or numeric key just works. Define the class at its real
breadth today, not the minimum a single example needs.

When a key has to hold something outside that set - a dot, a space, an arbitrary
character - TOML lets you **quote** it. A **basic quoted key** uses double quotes and
reads like a basic string (`"127.0.0.1"` is one key, dots and all), and a **literal
quoted key** uses single quotes and takes its content verbatim. In both, the stored
key is the text with the surrounding quotes removed. The quoting is only about
writing the name; the key itself is just the characters inside. Recognizing which of
the three forms a key uses, and stripping quotes when present, is today's work.
