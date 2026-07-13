---
project: build-a-diff-tool
lesson: 9
title: Diagonals and the V array
overview: Myers tracks progress not by grid cell but by diagonal - and for each diagonal it remembers only the single furthest point reached so far, in an array called V. Today you implement the greedy choice that extends V one edit deeper - move down or move right.
goal: Given the previous V array, compute the furthest x on a diagonal by choosing a down or a right move.
spec:
  scenario: The furthest-reaching move on a diagonal
  status: failing
  lines:
    - kw: Given
      text: 'the V array after processing d = 0 for a = ["a", "b", "c"], b = ["a", "x", "c"], where V[0] = 1'
    - kw: When
      text: 'the pass processes d = 1'
    - kw: Then
      text: 'on diagonal k = -1 it must move down (k equals -d), taking x = V[0] = 1; on diagonal k = 1 it must move right (k equals d), taking x = V[0] + 1 = 2'
    - kw: And
      text: 'processing d = 2 on the interior diagonal k = 0, it compares neighbours V[-1] = 1 and V[1] = 2 and follows the larger with a downward move, giving x = 2'
code:
  lang: go
  source: |
    // V[k] = furthest x reached on diagonal k = x - y.
    // (store with an offset so negative k indexes safely.)
    func furthestX(V map[int]int, k, d int) int {
      if k == -d || (k != d && V[k-1] < V[k+1]) {
        return V[k+1] // came from the diagonal above: a downward move
      }
      return V[k-1] + 1 // came from the diagonal below: a rightward move
    }
checkpoint: You can extend the furthest-reaching path on any diagonal by one edit. Commit and stop here.
---

Every grid point sits on a **diagonal** numbered `k = x - y`. A right move (delete) increases `k` by one; a down move (insert) decreases it by one; a diagonal (keep) leaves `k` unchanged. After spending `d` edits you can only be on diagonals `-d, -d+2, ..., d` - same parity as `d` - and the beautiful economy of Myers is that for each such diagonal you record just **one number**: `V[k]`, the largest `x` reached on it so far. That whole array is the algorithm's memory.

To push one edit deeper on diagonal `k`, you arrive from an adjacent diagonal: from `k+1` by moving **down** (an insertion) or from `k-1` by moving **right** (a deletion). Greedily, you pick whichever neighbour is already **further along** so your new point reaches as far as possible - taking `V[k+1]` (down) when it is ahead, or `V[k-1]+1` (right) otherwise. The edges force your hand: on the lowest diagonal `k = -d` you can only have come from above (down), and on the highest `k = d` only from below (right). After choosing `x`, the diagonal fixes `y = x - k`, and next lesson you slide the snake and watch `d` climb until you reach the far corner.
