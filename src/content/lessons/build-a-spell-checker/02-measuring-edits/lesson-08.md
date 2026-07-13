---
project: build-a-spell-checker
lesson: 8
title: Levenshtein distance
overview: Flagging a wrong word is easy - suggesting the right one needs a way to measure how far apart two words are. Today you build edit distance, the number of single-character edits that turn one word into another, and it becomes the correctness core of every suggestion.
goal: Compute the minimum number of insertions, deletions, and substitutions that turn one string into another.
spec:
  scenario: The edit distance between two words
  status: failing
  lines:
    - kw: Given
      text: any two strings
    - kw: When
      text: their edit distance is computed
    - kw: Then
      text: 'Distance("kitten", "sitting") is 3 and Distance("sunday", "saturday") is 3'
    - kw: And
      text: 'Distance("cat", "cat") is 0, Distance("", "abc") is 3, and Distance("abc", "") is 3'
code:
  lang: go
  source: |
    // classic DP: d[i][j] = distance between the first i chars of a
    // and the first j chars of b. Row 0 and column 0 are 0..n (all
    // inserts / all deletes). For each cell:
    //   cost = 0 if a[i-1]==b[j-1] else 1
    //   d[i][j] = min(d[i-1][j]+1,   // delete from a
    //                 d[i][j-1]+1,   // insert into a
    //                 d[i-1][j-1]+cost) // match or substitute
    func Distance(a, b string) int { /* fill the table, return d[len(a)][len(b)] */ }
checkpoint: You can measure how many edits separate any two words. Commit and stop here.
---

**Edit distance** (Levenshtein distance) is the number of single-character
**insertions, deletions, and substitutions** needed to turn one string into
another. `kitten` to `sitting` takes three - substitute the `k`, substitute the
`e`, insert a `g` - so the distance is 3. It is the measure that lets a checker say
`korrect` is close to `correct` but far from `banana`, and every candidate you ever
rank will be scored by it.

The clean way to compute it is a small **dynamic-programming table**. Cell
`d[i][j]` holds the distance between the first `i` letters of one word and the
first `j` of the other; the top row and left column are the pure insert/delete
costs, and every other cell is the cheapest of three moves. Pin the edges now: an
empty string is exactly the length of the other word away, and a word is distance
0 from itself. Those boundaries are where a naive implementation goes wrong, so the
spec fixes them first.
