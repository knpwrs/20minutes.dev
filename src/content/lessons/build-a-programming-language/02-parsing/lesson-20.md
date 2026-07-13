---
project: build-a-programming-language
lesson: 20
title: Parsing a whole program
overview: Your parser now covers every statement and expression the language has so far. Today you point it at a multi-statement program and wire it into the REPL, which prints the parsed tree back as normalized source.
goal: Parse a multi-statement program and have the REPL print the whole tree back as source.
spec:
  scenario: Parsing and printing a multi-statement program
  status: failing
  lines:
    - kw: Given
      text: 'the source: let x = 5; let y = x * 2; if (y > 5) { y }'
    - kw: When
      text: 'the parser parses the program'
    - kw: Then
      text: 'the program has exactly three statements'
    - kw: And
      text: 'the REPL prints the program back as let x = 5;let y = (x * 2);if (y > 5) y'
code:
  lang: go
  source: |
    // Program.String() concatenates each statement's String()
    func (p *Program) String() string {
      var out strings.Builder
      for _, s := range p.Statements { out.WriteString(s.String()) }
      return out.String()
    }
    // in the REPL, replace token-printing with: parse, then print program.String()
checkpoint: The REPL parses whatever you type and prints the syntax tree back as source - the parser is complete. Commit and stop for today.
---

This closes the parsing chapter by running the whole parser at once. A real
program is a **sequence of statements**, and `Program.String()` just concatenates
each statement's printed form. Parsing `let x = 5; let y = x * 2; if (y > 5) { y }`
should yield exactly three top-level statements, with the middle one's value
correctly grouped as `(x * 2)`.

Wiring this into the REPL upgrades it from a token dumper to a **tree printer**:
type source, and it echoes back the normalized form the parser understood -
parentheses made explicit, precedence resolved. That round-trip is the clearest
proof the parser is correct, and it is the input the next chapter's evaluator will
finally *run*.
