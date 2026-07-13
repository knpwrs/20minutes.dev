---
project: build-sha-256
lesson: 15
title: Expanding the full schedule
overview: Applying the recurrence 48 times fills out the complete 64-word message schedule for a block. Today you wrap it in one function and pin the last word for the "abc" block.
goal: Expand a 64-byte block into the full 64-word message schedule W0 through W63.
spec:
  scenario: The full schedule for the "abc" block
  status: failing
  lines:
    - kw: Given
      text: 'the "abc" block and the recurrence from the previous lesson'
    - kw: When
      text: 'ExpandSchedule(block) returns all 64 words, W[0..15] read from the block and W[16..63] grown by the recurrence in order'
    - kw: Then
      text: 'the array has exactly 64 words, with W[0] still 0x61626380 and W[16] still 0x61626380'
    - kw: And
      text: 'the final word W[63] is 0x12b1edeb'
code:
  lang: go
  source: |
    func ExpandSchedule(block []byte) [64]uint32 {
      var w [64]uint32
      first := MessageWords(block)
      copy(w[:16], first[:])
      for t := 16; t < 64; t++ {
        // w[t] = SmallSigma1(w[t-2]) + w[t-7] + SmallSigma0(w[t-15]) + w[t-16]
        // (fill in, all mod 2^32)
      }
      return w
    }
checkpoint: You can expand a block into its full 64-word schedule. The schedule is complete. Commit and stop here.
---

Growing the schedule is just applying last lesson's recurrence in a loop from
`t = 16` to `t = 63`, each step reading four words that already exist. Because the
words are computed strictly in order, every reference `W[t-2], W[t-7], W[t-15],
W[t-16]` points at a word filled earlier in the same loop - the recurrence never
looks ahead. Sixteen seed words in, sixty-four words out.

This is the per-block input the compression function will consume: one schedule
word per round. Pin the tail, `W[63] = 0x12b1edeb`, because it depends on the
entire chain of 48 recurrence steps - if any small sigma amount, index offset, or
modular add is off anywhere along the way, this last word will not match. Getting
`W[63]` right for the "abc" block is strong evidence the whole schedule is
correct before you build the rounds that rely on it.
