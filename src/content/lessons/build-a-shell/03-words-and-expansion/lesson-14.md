---
project: build-a-shell
lesson: 14
title: Variable expansion
overview: A shell substitutes `$NAME` with the variable's value before running a command. Today you add that expansion to the tokenizer, respecting the single-quote rule you set up two lessons ago.
goal: Expand `$NAME` to the value of the shell variable NAME while tokenizing, treating unset variables as empty and suppressing expansion inside single quotes.
spec:
  scenario: Substituting a variable's value
  status: failing
  lines:
    - kw: Given
      text: 'the shell variables (seeded from the environment) have X = "hi"'
    - kw: When
      text: 'the line: echo $X  is tokenized'
    - kw: Then
      text: 'the words are ["echo", "hi"]'
    - kw: And
      text: 'an unset $NOPE expands to "" (empty), while inside single quotes ''$X'' stays the literal "$X"'
code:
  lang: c
  source: |
    // when not inside single quotes, a '$' starts a name
    // vars = the shell's variable table, seeded from the environment at startup
    if (c == '$' && in_quote != '\'') {
        char name[64]; read_name(name);     // [A-Za-z_][A-Za-z0-9_]*
        char *val = var_get(vars, name);
        append_str(val ? val : "");          // unset -> empty
    }
checkpoint: '`echo $HOME` prints your home directory. Commit and stop here.'
---

**Expansion** is the step where the shell rewrites your line before running it,
and the most common expansion is `$NAME` - replace it with the value of the
variable `NAME`. The shell keeps its own **variable table**, seeded at startup
from a copy of the environment, and expansion looks names up there. So with `HOME`
set to `/home/me`, the line `echo $HOME` becomes `echo /home/me` before `echo`
ever runs. An **unset** variable expands to the empty string, not an error -
shells are permissive here by design.

This is where single and double quotes finally diverge. Inside **single** quotes,
`$` is just a dollar sign - `'$X'` stays `$X` literally - because single quotes
suppress *all* expansion. Inside **double** quotes (and when unquoted), `$NAME`
expands normally. That is why you tracked the quote character while tokenizing:
expansion needs to know which kind of quote it is standing in. A variable name
runs from the `$` through the following letters, digits, and underscores, stopping
at the first character that cannot be part of a name.
