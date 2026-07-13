---
project: build-a-programming-language
lesson: 9
title: The syntax tree and its first leaves
overview: A parser turns the flat token stream into a tree that captures structure. Today you lay the tree's foundation - the node interfaces and the program root - and parse the two simplest leaves, integer and identifier expressions.
goal: Parse a single integer or identifier into an expression statement whose printed form is the value itself.
spec:
  scenario: Parsing a lone literal into the tree
  status: failing
  lines:
    - kw: Given
      text: 'the source 5'
    - kw: When
      text: 'the parser parses the program'
    - kw: Then
      text: 'the program has exactly one statement, an expression statement'
    - kw: And
      text: 'printing that statement yields the string 5, and parsing foobar likewise prints foobar'
code:
  lang: go
  source: |
    // every node can print itself back as source (String)
    type Node interface { String() string }
    type Statement interface { Node }
    type Expression interface { Node }
    type Program struct { Statements []Statement }
    type IntegerLiteral struct { Value int64 }
    func (il *IntegerLiteral) String() string { return fmt.Sprint(il.Value) }
    // Identifier{Value string} is the same shape - String returns the name
checkpoint: The parser produces a tree whose single node prints back as the original literal. Commit.
---

Where the lexer produced a flat list, the parser produces a **tree** that
captures how the pieces nest. Set up just the *scaffolding* now - every later
lesson adds one more kind of node to it: a `Node` interface whose one requirement
is that a node can print itself back as source (`String`), a `Program` that holds
a list of statements, and an `ExpressionStatement` wrapper for a statement that is
just an expression. Keep the parser itself minimal - a loop over statements and a
simple dispatch that reads today's two leaves by token type. The precedence
machinery that makes `+` and `*` bind correctly arrives in the next few lessons,
with the operators that need it; don't build it yet.

Today's leaves are the smallest expressions: an **integer literal** (parse the
digit text into a real number) and an **identifier** (carry the name). Both are
trivial, but wiring them through the `Program → ExpressionStatement → Expression`
path proves the skeleton holds. Making every node print itself is the trick that
keeps the rest of this chapter concrete - you can always check a parse by reading
its printed form.
