---
project: build-a-diff-tool
lesson: 4
title: The longest common subsequence
overview: A minimal diff keeps as many lines as it possibly can - and the largest set of lines shared, in order, by both documents is their longest common subsequence. Today you compute its length with the classic dynamic-programming table, the number the whole diff is built around.
goal: Build the LCS dynamic-programming table and return the length of the longest common subsequence.
spec:
  scenario: The LCS length of two small documents
  status: failing
  lines:
    - kw: Given
      text: 'the documents ["a", "b", "c"] and ["a", "x", "c"]'
    - kw: When
      text: 'lcsLength is computed via the (n+1) by (m+1) table'
    - kw: Then
      text: 'the length is 2 (the subsequence "a", "c"), and the bottom-right table cell C[3][3] equals 2'
    - kw: And
      text: 'the LCS length of "ABCABBA" and "CBABAC" (as 7 and 6 single-character lines) is 4'
code:
  lang: go
  source: |
    // C[i][j] = LCS length of a[:i] and b[:j]
    C := make([][]int, len(a)+1)
    for i := range C {
      C[i] = make([]int, len(b)+1)
    }
    for i := 1; i <= len(a); i++ {
      for j := 1; j <= len(b); j++ {
        if a[i-1] == b[j-1] {
          C[i][j] = C[i-1][j-1] + 1
        } else {
          C[i][j] = max(C[i-1][j], C[i][j-1])
        }
      }
    }
    return C[len(a)][len(b)]
checkpoint: You can compute the length of the longest common subsequence. Commit and stop here.
---

The insight that turns diffing into a solvable problem: a diff that keeps the most lines makes the fewest edits, and the most lines you can keep - in their original relative order - is exactly the **longest common subsequence** (LCS) of the two documents. "Subsequence" is looser than "substring": the shared lines need not be adjacent, just in the same order. For `["a","b","c"]` and `["a","x","c"]` the LCS is `["a","c"]`, length 2.

The standard way to compute it is a table `C` where `C[i][j]` is the LCS length of the first `i` lines of the old document and the first `j` lines of the new. Each cell looks at one more line from each side: if those two lines match, the answer grows by one from the diagonal neighbour; if not, it is the better of dropping a line from either side. The bottom-right cell is the answer. Today you only return the length - but you are building the whole table, and the next lesson walks back through it to recover the actual edit script.
