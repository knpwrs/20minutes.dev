---
title: 'Build an Expression Evaluator'
order: 53
lessons: 30
size: 'Small'
tech: ['Pratt parsing', 'Operator precedence', 'Expression evaluation']
estMin: 20
desc: 'Turn a string like 2 + 3 * 4 into a syntax tree and evaluate it with a Pratt parser.'
blurb: 'Turn a string like 2 + 3 * 4 into a syntax tree and evaluate it to 14, using the Pratt parsing technique where operator precedence and associativity fall out of one small loop of binding powers. Every lesson is one concrete spec with exact tokens, a fully parenthesized AST render, or an exact numeric result: 10 - 3 - 2 groups left to 5, 2 ^ 3 ^ 2 groups right to 512, parentheses override precedence, unary minus follows the -2^2 convention (which is -4), and malformed input reports a clear error with the position where it went wrong.'
overview: |
  Over 30 lessons you build an arithmetic expression evaluator from first principles: a small library that turns a string like `2 + 3 * 4` into an abstract syntax tree and evaluates it to an exact number. The heart of it is a Pratt parser (top-down operator precedence), the technique that makes operator precedence and associativity fall out of a single small loop of binding powers rather than a tangle of grammar rules.

  You start with a tokenizer that scans numbers, operators, and parentheses, then build the parser: prefix handlers for numbers, grouping, and unary minus, and infix handlers for the binary operators, with left-associative plus, minus, times, divide, and modulo and a right-associative power. On top of the tree you write an evaluator that computes with float64 values, an environment that maps variable names to numbers, and built-in functions like `sqrt`, `abs`, and `max` with comma-separated arguments. The final chapter adds clear error messages that point at the position where input went wrong, and a capstone that evaluates a batch of real expressions to their exact results.

  This is a focused, fully offline numeric expression evaluator, not a general programming language: it computes with double-precision floats, offers a fixed set of built-in functions, and evaluates one expression at a time. The finalize pass wraps the unchanged library in a small calculator REPL you can run, so the same code you build lesson by lesson also becomes an interactive calculator.
parts:
  - name: 'The tokenizer'
    count: 6
  - name: 'Parsing with binding power'
    count: 6
  - name: 'Evaluating the AST'
    count: 6
  - name: 'Variables and functions'
    count: 5
  - name: 'Errors and the capstone'
    count: 7
caveats:
  note: 'The library is complete and lesson-faithful (tokenizer, Pratt parser, and float64 evaluator with variables, built-in functions, and positioned error messages), and the finalize pass wraps it unchanged in a genuinely usable calculator REPL with variable assignment and persistent state, but it deliberately stops short of comparisons and booleans, user-defined functions, and readline editing to avoid inventing subsystems the lessons never introduced.'
  future:
    - 'Comparison and boolean expressions (< <= > >= == != and the logical operators) with a truthiness convention, so the evaluator can express conditions'
    - 'User-defined functions (for example f(x) = x * 2) via a closure or function value in the environment or a parallel function table'
    - 'A wider built-in library (trigonometry, logarithms, exp, and named constants) registered in the same dispatch-and-arity-check style as sqrt and max'
    - 'A single-expression CLI flag (evaluate one expression from the command line without stdin) and reading a script from a file'
    - 'Readline-style history and editing in the REPL, which is currently a dependency-free line-buffered reader'
resources:
  - title: 'Top Down Operator Precedence'
    author: 'Vaughan R. Pratt'
    url: 'https://dl.acm.org/doi/10.1145/512927.512931'
    note: 'The original 1973 paper that introduced the technique this project is built on. Pratt shows how attaching a binding power to each token and a small recursive loop makes precedence and associativity fall out without a formal grammar.'
  - title: 'Pratt Parsers: Expression Parsing Made Easy'
    author: 'Bob Nystrom'
    url: 'https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/'
    note: 'The clearest modern explanation of Pratt parsing: prefix and infix handlers, binding powers, and how left versus right binding power encodes associativity. The direct inspiration for this project arc.'
  - title: 'Crafting Interpreters'
    author: 'Robert Nystrom'
    url: 'https://craftinginterpreters.com/'
    note: 'The chapter Compiling Expressions builds a Pratt parser in a full language implementation. Read it to see the technique scale from a calculator to a real interpreter.'
  - title: 'Shunting Yard Algorithm'
    author: 'Edsger W. Dijkstra'
    url: 'https://en.wikipedia.org/wiki/Shunting_yard_algorithm'
    note: 'The classic stack-based alternative to Pratt parsing for the same problem. Comparing the two is the fastest way to understand what binding powers buy you over an explicit operator stack.'
  - title: 'Top-Down Operator Precedence (Pratt) Parsing'
    author: 'Eli Bendersky'
    url: 'https://eli.thegreenplace.net/2010/01/02/top-down-operator-precedence-parsing/'
    note: 'A careful walkthrough that connects Pratt parsing back to plain recursive descent and works several precedence and associativity examples by hand.'
  - title: 'Writing An Interpreter In Go'
    author: 'Thorsten Ball'
    url: 'https://interpreterbook.com/'
    note: 'Builds a Pratt parser for a small language step by step, with the prefix and infix registration pattern laid out in full. A good companion once you want to grow this evaluator toward a language.'
---
