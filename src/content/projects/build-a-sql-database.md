---
title: 'Build a SQL Database'
order: 9
lessons: 45
size: 'Medium'
tech: ['Recursive descent', 'Relational operators', 'Query execution']
estMin: 20
desc: 'Turn SQL text into answers: tokenize, parse, and execute real queries over tables you build yourself.'
blurb: 'Start with a typed value in memory and end with an interactive SQL prompt that runs SELECT, JOIN, GROUP BY, and more. Every lesson gives you a concrete spec to hit, and the engine grows one operator at a time.'
overview: |
  Over 45 lessons you build a working SQL database engine from scratch: the in-memory tables that hold typed rows, a tokenizer and recursive-descent parser that turn SQL text into a syntax tree, an execution engine that runs that tree as a pipeline of relational operators, and a durability layer that keeps your data safe across a crash.

  By the end you have an interactive SQL prompt that runs a real subset of SQL - CREATE TABLE, INSERT, SELECT with WHERE / ORDER BY / LIMIT, the aggregate functions with GROUP BY and HAVING, INNER JOIN across tables, UPDATE and DELETE - and persists your data so it survives not just a clean restart but a crash mid-write, using atomic snapshots, a write-ahead log that flushes every committed mutation, and replay on open that loses nothing acknowledged.

  This is a teaching-grade engine: it executes each query as written, directly and correctly, but stops short of the machinery a production database adds on top - indexes, a cost-based query optimizer, transactions and concurrency, and subqueries. What you finish with is the honest core those systems are built around.
parts:
  - name: 'In-memory tables'
    count: 8
  - name: 'Tokenizing SQL'
    count: 5
  - name: 'Parsing SQL'
    count: 8
  - name: 'Executing queries'
    count: 9
  - name: 'Aggregates, joins & persistence'
    count: 10
  - name: 'Durability'
    count: 5
caveats:
  note: 'The engine correctly executes the standard single-table and two-table-join SQL surface (filtering, sorting, limiting, grouping with aggregates, and inner joins, all composable) with graceful error handling, and it persists crash-safely - atomic snapshots, a fsync''d write-ahead log, and replay on open recover every committed mutation after a crash - but it stops well short of real SQL: no NULL/three-valued logic, no arithmetic expressions, only single-column GROUP BY / ORDER BY / UPDATE SET, and INNER-only two-table joins via a naive nested-loop.'
  future:
    - 'Add a NULL literal to the grammar and give WHERE/HAVING proper three-valued (UNKNOWN-propagating) logic plus IS NULL / IS NOT NULL'
    - 'Add arithmetic expressions (+ - * / and parentheses) so WHERE and the SELECT list can compute values, not only compare bare columns'
    - 'Generalize GROUP BY, ORDER BY, and UPDATE SET from a single column/assignment to comma-separated lists'
    - 'Add LEFT/RIGHT OUTER JOIN, joins across more than two tables, and table aliases'
    - 'Add a real fractional numeric type (float or decimal) so AVG stops truncating with integer division'
    - 'Add LIMIT ... OFFSET and DISTINCT'
resources:
  - title: 'Crafting Interpreters'
    author: 'Robert Nystrom'
    url: 'https://craftinginterpreters.com/'
    note: 'The clearest guide to tokenizers and recursive-descent parsers - the exact techniques the SQL front-end in this project uses.'
  - title: 'Database System Concepts'
    author: 'Silberschatz, Korth, Sudarshan'
    note: 'The standard textbook on the relational model, relational algebra, and query processing that the execution engine implements.'
  - title: 'Architecture of a Database System'
    author: 'Joseph M. Hellerstein, Michael Stonebraker, James Hamilton'
    url: 'https://dsf.berkeley.edu/papers/fntdb07-architecture.pdf'
    note: 'A survey tying the query parser, planner, and execution operators into one architecture - the map for how the pieces you build fit together.'
  - title: 'How Query Engines Work'
    author: 'Andy Grove'
    url: 'https://howqueryengineswork.com/'
    note: 'A short, practical walkthrough of building a query engine as a pipeline of operators, mirroring this project''s execution model.'
  - title: 'Readings in Database Systems (The Red Book)'
    author: 'Peter Bailis, Joseph M. Hellerstein, Michael Stonebraker'
    url: 'http://www.redbook.io/'
    note: 'Curated classic papers for going deeper into optimization, transactions, and the systems ideas this teaching engine leaves out.'
---
