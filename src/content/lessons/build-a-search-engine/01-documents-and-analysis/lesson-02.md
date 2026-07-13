---
project: build-a-search-engine
lesson: 2
title: Tokenizing text
overview: Today you split raw text into word tokens by breaking on everything that is not a letter or digit. This is the first step of turning a document into something searchable.
goal: Split a string into a list of word tokens, discarding punctuation and spacing.
spec:
  scenario: Breaking text into tokens
  status: failing
  lines:
    - kw: Given
      text: 'the text "Hello, world! 123"'
    - kw: When
      text: it is tokenized
    - kw: Then
      text: 'the tokens are ["Hello", "world", "123"]'
    - kw: And
      text: '"  spaced   out  " tokenizes to ["spaced", "out"]'
code:
  lang: python
  source: |
    # a token is a maximal run of letters/digits;
    # everything else is just a separator
    import re
    def tokenize(text):
        ...  # find every run of [A-Za-z0-9]
reading: 'Manning, Introduction to Information Retrieval - ch. 2.2.'
checkpoint: Raw text becomes a clean list of word tokens. Commit and stop here.
---

A document is one long string, but search works on **words**. **Tokenizing** is
the act of chopping that string into individual tokens. The simplest useful rule:
a token is a maximal run of letters and digits, and everything else - spaces,
commas, exclamation marks - is just a separator that gets thrown away.

This rule is crude on purpose. It splits `don't` into `don` and `t`, and it has no
idea about hyphenated words. That is fine: a simple, predictable tokenizer is easy
to reason about, and every later normalization step assumes it runs first.
