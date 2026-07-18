---
project: build-an-llm
lesson: 39
title: Tokens to logits
overview: The transformer block already turns embedded tokens into an 8-number vector per position. Today you add one more linear layer that projects each position down to one score per vocabulary character - the model's logits.
goal: Add an output projection so the model's forward pass runs all the way from token ids to a length-4 logit vector at every position.
spec:
  scenario: Logits for the first training window
  status: failing
  lines:
    - kw: Given
      text: 'the training text "abcdabcdabcdabcd" (16 characters, the 4-character cycle "abcd" repeated four times), whose distinct characters sort as a=0, b=1, c=2, d=3'
    - kw: And
      text: 'the first 3-character window of that text, "abc", as token ids [0, 1, 2]'
    - kw: And
      text: 'the token and position embedding tables (lesson 26) and the transformer block (lesson 38), all with their previously pinned weights'
    - kw: And
      text: 'a new output projection: a linear layer from 8 to 4, an 8x4 weight matrix built from the same formula as lesson 28''s Wq/Wk/Wv - (((row*5 + col*11 + seed*13) mod 7) - 3) * 0.1 with seed 16 - and every bias 0'
    - kw: When
      text: the tokens are embedded, run through the block, and projected through the output layer
    - kw: Then
      text: 'the result has one row per position (3 rows) and one column per vocabulary character (4 columns)'
    - kw: And
      text: 'the last row - the logits for predicting the character after "abc" - is about [-0.117084, 0.035015, 0.047163, 0.050879]'
code:
  lang: go
  source: |
    // reuse lesson 26/27's Embed, lesson 38's Block, then project to VocabSize
    func (m *LM) Forward(tokens []int) *Tensor {
      x := Embed(m.TokEmb, m.PosEmb, tokens)
      x = m.Block.Forward(x)
      return m.Out.Forward(x) // shape: len(tokens) x VocabSize
    }
checkpoint: Token ids now flow all the way to logits - embedding, the transformer block, and a final projection to one score per vocabulary character. Commit and stop for today.
---

A **logit** is just a raw, unnormalized score - one per vocabulary character, with no constraint that they be positive or sum to anything in particular. Producing them is the mirror image of lesson 26's embedding: instead of looking up a `DModel`-wide vector for each token, today's output projection takes the block's `DModel`-wide vector at each position and maps it back down to `VocabSize` numbers, one competing for each possible next character.

This is genuinely the last new piece of the model's shape. Every position gets its own row of logits, but the training text's fixed window size means only the last row - the prediction for what comes after the whole context - is one you will ever look at, which is exactly what the next two lessons do.
