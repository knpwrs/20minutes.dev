---
project: build-an-llm
lesson: 26
title: A token becomes a vector (embedding lookup)
overview: 'A token is just an integer until two lookup tables turn it into a vector - one for what it is, one for where it sits.'
goal: Build a token embedding table and a position embedding table, and combine them into the vector a transformer actually operates on.
spec:
  scenario: Turning a tokenized sequence into input vectors
  status: failing
  lines:
    - kw: Given
      text: 'a vocabulary of 4 tokens, a=0, b=1, c=2, d=3 (a tokenizer supplying this mapping is a later lesson - assume it here), and a model width of 8'
    - kw: And
      text: 'a token embedding table with one row per token: row0=[0.1, 0.2, -0.2, -0.1, 0.0, 0.1, 0.2, -0.2], row1=[-0.2, -0.1, 0.0, 0.1, 0.2, -0.2, -0.1, 0.0], row2=[0.0, 0.1, 0.2, -0.2, -0.1, 0.0, 0.1, 0.2], row3=[0.2, -0.2, -0.1, 0.0, 0.1, 0.2, -0.2, -0.1]'
    - kw: And
      text: 'a position embedding table with one row per position in a 3-token window: row0=[-0.05, 0.0, 0.05, 0.1, -0.1, -0.05, 0.0, 0.05], row1=[0.05, 0.1, -0.1, -0.05, 0.0, 0.05, 0.1, -0.1], row2=[-0.1, -0.05, 0.0, 0.05, 0.1, -0.1, -0.05, 0.0]'
    - kw: And
      text: 'the sequence "bac", tokenized to [1, 0, 2]'
    - kw: When
      text: 'each position''s input vector is built as its token''s row plus that position''s row'
    - kw: Then
      text: 'position 0 (token b) gives [-0.25, -0.1, 0.05, 0.2, 0.1, -0.25, -0.1, 0.05]'
    - kw: And
      text: 'position 1 (token a) gives [0.15, 0.3, -0.3, -0.15, 0.0, 0.15, 0.3, -0.3]'
    - kw: And
      text: 'position 2 (token c) gives [-0.1, 0.05, 0.2, -0.15, 0.0, -0.1, 0.05, 0.2]'
code:
  lang: go
  source: |
    // one row of tokEmb, plus one row of posEmb, elementwise - reuse
    // chapter 1's Add per entry, nothing new to invent per cell
    func Embed(tokEmb, posEmb *Tensor, tokens []int) *Tensor {
      out := NewTensor(len(tokens), tokEmb.Cols())
      for t, tok := range tokens {
        // out.Data[t][k] = Add(tokEmb.Data[tok][k], posEmb.Data[t][k])
      }
      return out
    }
checkpoint: You can turn any tokenized sequence into the (positions x model-width) tensor every later lesson in this chapter builds on. Commit and stop for today.
---

A token embedding table is nothing more than a tensor with one row per vocabulary entry: look up row `tok` and you have a vector standing in for that token's identity. But identity alone is not enough - the same token means something different depending on where it sits in the sequence ("b" as the first character is a different signal from "b" as the last), so a second table, indexed by position instead of token, contributes a vector for "where." Adding the two rows together, one lookup from each table, is how a bare integer becomes the vector every later computation in this chapter actually operates on.

Both tables here are exactly the tensor type from chapter 3 - nothing new about their shape, only about how they are indexed. From now on, `X` (today's three rows) is the fixed input every remaining lesson in this chapter reuses: queries, keys and values are all projections of it, and the transformer block at the end of the chapter still starts from it.
