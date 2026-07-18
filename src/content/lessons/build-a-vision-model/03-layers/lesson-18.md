---
project: build-a-vision-model
lesson: 18
title: Max pooling as a layer
overview: Max pooling as a layer is the same 2x2 downsampling lesson 13 built, with one addition - it now remembers which input position actually won each window, since a later lesson needs to send a gradient straight back there.
goal: 2x2 max-pool both ReLU channels from lesson 17, recording which input position won each window under a pinned tie-break rule.
spec:
  scenario: Max pooling two channels, every window a tie
  status: failing
  lines:
    - kw: Given
      text: 'the ReLU output from lesson 17 - channel 0, values 0, 2, 2, 0 in every row, and channel 1, values 0.5, 0.5, 1.5, 1.5 in every row, each 4 by 4'
    - kw: When
      text: 'each channel is downsampled by the same 2x2 max pooling as lesson 13, breaking ties by keeping the first value encountered scanning a window in row-major order - top-left, then top-right, then bottom-left, then bottom-right'
    - kw: Then
      text: 'channel 0 pools to 2 in all four output cells - every window is a tie between two equal 2s'
    - kw: And
      text: 'the top-left window of channel 0 records its winner at row 0, column 1 - the first 2 encountered in that scan order'
    - kw: And
      text: 'the bottom-right window of channel 0 records its winner at row 2, column 2 - positions are absolute coordinates in the 4 by 4 input, not offsets inside the window, which would have been row 0, column 0 here'
    - kw: And
      text: 'channel 1 pools to 0.5, 1.5 in row 0 and 0.5, 1.5 in row 1 - every window is a 4-way tie'
    - kw: And
      text: 'the top-left window of channel 1 records its winner at row 0, column 0 - the first cell scanned in a 4-way tie'
code:
  lang: go
  source: |
    // same 2x2 scan as lesson 13's maxOf4, but now remember WHERE the max was.
    // Row and Col are absolute positions in the input, not window offsets.
    type Argmax struct{ Row, Col int }
    // scan a window in order (0,0) (0,1) (1,0) (1,1); use a strict greater-than
    // comparison so later equal values never replace the first one recorded
checkpoint: Pooling now records the exact input position each output cell came from, and you have exercised the tie-break rule on both a 2-way and a 4-way tie. Commit and stop for today.
---

Pooling here is the same 2x2 max downsampling lesson 13 built for the classical pipeline - split the grid into non-overlapping blocks, keep the largest value in each. What lesson 13 never had to answer is which of the four values won, because nothing downstream needed to know. A layer inside a network does need to know: once gradients flow backward, a pooled output's gradient has to go back to exactly the one input pixel that produced it, and nowhere else.

That makes the tie-break rule load-bearing rather than a footnote. Scan each 2 by 2 window in row-major order - top-left, top-right, bottom-left, bottom-right - and keep the first value that is strictly greater than everything seen so far in that window; equal values never displace an earlier one. Today's example is not a gentle case: every single window, in both channels, is a tie, so the rule is doing real work at every position rather than sitting unused.
