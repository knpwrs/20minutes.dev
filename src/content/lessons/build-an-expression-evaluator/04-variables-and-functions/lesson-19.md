---
project: build-an-expression-evaluator
lesson: 19
title: Variable references
overview: Expressions become far more useful once they can name values, so today you teach the tokenizer to read identifiers and the parser to turn a name into a variable reference node.
goal: Scan an identifier into an Ident token and parse it into a Var node.
spec:
  scenario: A name parses to a variable reference
  status: failing
  lines:
    - kw: Given
      text: 'the input "x"'
    - kw: When
      text: 'it is parsed and rendered with String'
    - kw: Then
      text: 'the rendering is "x"'
    - kw: And
      text: 'parsing "foo_1" renders as "foo_1", so a name may contain letters, digits, and underscores'
code:
  lang: go
  source: |
    // tokenizer: a name starts with a letter or underscore, then continues
    // with letters, digits, or underscores
    case isAlpha(c):                       // isAlpha: a-z, A-Z, or '_'
      j := i
      for j < len(in) && (isAlpha(in[j]) || isDigit(in[j])) { j++ }
      toks = append(toks, Token{Ident, in[i:j], i}); i = j
    // parser nud: an Ident becomes a variable reference
    type Var struct { Name string; Pos int }
    func (v *Var) String() string { return v.Name }
    // in nud: if t.Kind == Ident { return &Var{t.Text, t.Pos}, nil }
checkpoint: Names scan to Ident tokens and parse into Var nodes. Commit and stop here.
---

A **variable** is just a name that stands for a value. Reading one takes a new
scanner rule, close cousin to the number rule: an identifier starts with a letter or
underscore and then runs through letters, digits, and underscores, so `foo_1` is a
single `Ident` token. Defining the identifier's full character set now, rather than
the bare minimum, means realistic names work from the start and no later lesson has to
widen the rule.

In the parser, a name with nothing before it is a **prefix** form, so it gets a `nud`
case: an `Ident` token becomes a `Var` node holding the name and its position. The
position rides along for the error chapter, where an unknown name will report exactly
where it appeared. Today the parser only builds the reference; giving it a value is
the next lesson's job, and it needs the environment that has been waiting empty since
the evaluator began.
