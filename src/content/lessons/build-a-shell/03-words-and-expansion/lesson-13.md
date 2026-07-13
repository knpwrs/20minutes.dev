---
project: build-a-shell
lesson: 13
title: Backslash escapes
overview: A backslash makes the next character literal, so you can put a space or a quote inside a word without quoting the whole thing. Today you add that one-character escape to the tokenizer.
goal: Handle a backslash outside quotes so the following character is taken literally and never acts as a separator.
spec:
  scenario: Escaping a single character
  status: failing
  lines:
    - kw: Given
      text: 'the line: a\ b'
    - kw: When
      text: the line is tokenized
    - kw: Then
      text: 'the result is one word ["a b"] (the escaped space does not split)'
    - kw: And
      text: 'the line: \"  tokenizes to a single literal double-quote character'
code:
  lang: c
  source: |
    if (!in_quote && c == '\\') {
        c = next_char();       // consume the following char
        append_char(c);        // ...and take it literally
        continue;
    }
checkpoint: A backslash escapes any single character. Commit and stop here.
---

Quoting a whole span is overkill when you only need to protect **one** character.
The **backslash** does exactly that: it strips any special meaning from the single
character that follows it, then disappears. So `a\ b` is the one word `a b` -
the escaped space is just a space, not a separator - and `\"` is a literal
double-quote that does not start a quoted span.

Today's rule is the simple, common case: a backslash **outside** quotes. Inside
single quotes a backslash is just a backslash (single quotes protect
*everything*, even the escape character), and its behavior inside double quotes is
narrower - it only escapes a few characters like `$`, `` ` ``, `"`, and `\`. Keep
today focused on the unquoted case; the tokenizer you are growing has room for the
finer rules as they come up.
