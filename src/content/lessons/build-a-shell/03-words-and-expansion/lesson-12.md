---
project: build-a-shell
lesson: 12
title: Quotes group a word
overview: Whitespace splits words, but quotes override that so a single argument can contain spaces. Today you rework the tokenizer to respect single and double quotes and to glue adjacent pieces into one word.
goal: Split a line into words while treating quoted spans as literal, removing the quotes, and joining adjacent quoted and unquoted pieces.
spec:
  scenario: Quoted spans become single words
  status: failing
  lines:
    - kw: Given
      text: 'the line: echo ''hello world'''
    - kw: When
      text: the line is tokenized
    - kw: Then
      text: 'the words are ["echo", "hello world"] (one argument, quotes removed)'
    - kw: And
      text: 'the line: a"b"c  tokenizes to ["abc"] (adjacent pieces join into one word)'
code:
  lang: c
  source: |
    // build one word char by char; a quote flips a "quoted" mode
    // inside quotes, spaces are literal; the quote chars themselves are dropped
    if (c == '\'' || c == '"') { in_quote = c; continue; }  // opening
    if (c == in_quote)         { in_quote = 0; continue; }  // closing
    if (!in_quote && isspace(c)) end_word();
    else append_char(c);
checkpoint: Your tokenizer handles quoted arguments with spaces in them. Commit and stop here.
---

Yesterday's tokenizer split purely on whitespace, so there was no way to pass an
argument that *contains* a space. **Quotes** fix that: everything between a pair
of `'...'` or `"..."` is one literal chunk, spaces and all, and the quote
characters themselves are removed from the result. So `echo 'hello world'` passes
`echo` a single argument, `hello world`.

The subtle rule is that quoting is about **spans, not whole words**. A word can be
built from several adjacent pieces - quoted and unquoted - with no space between
them, and they all fuse into one: `a"b"c` is the single word `abc`, and
`"$HOME"/bin` will later be one word too. So think in terms of "am I currently
inside a quote?" as you scan character by character, ending a word only on
*unquoted* whitespace. Single and double quotes behave the same for grouping
today; their difference - whether `$` expands inside them - arrives once expansion
does.
