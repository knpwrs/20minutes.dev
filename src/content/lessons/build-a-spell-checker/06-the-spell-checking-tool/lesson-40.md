---
project: build-a-spell-checker
lesson: 40
title: 'Capstone: checking a passage'
overview: The final lesson runs the whole tool on a real multi-line passage - train a dictionary, ignore a name, check the text, and print a full report with line, column, and ranked suggestions for every misspelling.
goal: Run the complete checker over a multi-line passage and produce the exact human-readable report.
spec:
  scenario: A full report over real prose
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary holding the words the, quick, brown, fox, jumps, over, lazy, dog, and a Checker with Ignore("Zaphod")'
    - kw: When
      text: 'the passage "The quikc brown fox\nZaphod jumpd over teh lazy dog" is checked and each Issue formatted'
    - kw: Then
      text: 'the report is exactly these three lines, in order: `line 1, col 5: "quikc" -> did you mean "quick"?`, then `line 2, col 8: "jumpd" -> did you mean "jumps"?`, then `line 2, col 19: "teh" -> did you mean "the"?`'
    - kw: And
      text: '"Zaphod" is not reported (ignored), and every known word is skipped'
code:
  lang: go
  source: |
    // 1. build the dictionary (AddAll the vocabulary, or TrainFrom text)
    // 2. checker := NewChecker(dict); checker.Ignore("Zaphod")
    // 3. for _, issue := range checker.Check(passage):
    //        fmt.Println(FormatIssue(issue))
    // each Issue already carries line, column, and top suggestions
checkpoint: Your spell checker reads a passage and reports every misspelling with a ranked fix. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a real, runnable **spell
checker**. Give it a passage and it finds every word it does not recognize, points
at each by line and column, and offers the words you most likely meant - skipping
the name you told it to ignore and every word it already knows. `quikc`, `jumpd`,
and `teh` are caught and corrected; `Zaphod`, `brown`, `fox`, and the rest pass
untouched.

Every layer is doing its job at once. The tokenizer finds the words and their
places, membership decides which are suspect, the BK-tree index finds each typo's
neighbors, frequency ranks them, case-matching and formatting make the output
readable. From an empty word set that answered "unknown" you have built the honest
core of a spell checker - Norvig's edit-distance correction over a metric-tree
index - the same design that sits inside the tools you use every day, minus the
context and grammar models they layer on top. That is a real tool, and it is yours.
