---
title: Build an LLM
order: 56
lessons: 46
size: Medium
tech:
  - Autograd
  - Attention
  - Backpropagation
estMin: 20
desc: 'Build a transformer from the derivative up: autograd, attention, and a character model you train and sample.'
blurb: 'Start with a single number that remembers where it came from, and finish with a character-level transformer you trained yourself. No tensor library, no framework - every gradient in the model comes from an engine you wrote.'
overview: |
  You will build a transformer from nothing but arithmetic. First an automatic
  differentiation engine: a value that records the operations performed on it,
  then a backward pass that walks that record and hands you every gradient.
  Everything after it - neurons, matrix multiplies, attention, the whole
  transformer - is built from that one engine, one scalar at a time.

  From there you assemble the pieces a transformer is actually made of: tensors
  and matrix multiply, softmax and cross-entropy, then queries, keys and values,
  causal masking, multi-head attention, residual connections and layer
  normalization. The last chapter wires that stack into a character-level model,
  trains it, and samples from it.

  Be clear-eyed about the end result, because it is the honest boundary this
  project is built to reach. Every scalar is a heap-allocated node with its own
  gradient closure, so the finished model is a few hundred parameters trained on
  one CPU core - and at that scale it learns to continue a short, simple,
  repeating pattern, not to write words. That is the whole point: the win is
  watching every mechanism a production model uses - autograd, attention, a
  training loop - compose and actually learn, at a size you can read end to end
  and step through by hand. Making it speak English would take a tensor library
  and orders of magnitude more compute; understanding exactly why is what you
  leave with.
parts:
  - name: Autograd from scratch
    count: 10
  - name: A network that learns
    count: 8
  - name: Tensors
    count: 7
  - name: Attention
    count: 13
  - name: The language model
    count: 8
caveats:
  note: 'The finished program runs end to end - it trains, prints loss checkpoints, greedily generates, and fails fast on bad input - but it is a teaching-scale toy that learns to continue a 4-character repeating pattern, not a language model that produces English.'
  future:
    - Replace the scalar Value-per-cell autograd with vectorized tensor math so training scales past a 16-character string
    - Stack multiple transformer blocks instead of just one
    - Add a real tokenizer (byte-pair encoding or a larger character set) instead of 4 hardcoded letters
    - Swap plain fixed-rate SGD for Adam with a learning-rate schedule
    - Add mini-batching and shuffling instead of full-batch gradient descent every step
    - Add model save/load so the demo can generate from a previously trained model instead of retraining every run
resources:
  - title: Deep Learning
    author: Ian Goodfellow, Yoshua Bengio, Aaron Courville
    url: https://www.deeplearningbook.org/
    note: The standard reference. Chapter 6 covers backpropagation properly.
  - title: Attention Is All You Need
    author: Vaswani et al.
    url: https://arxiv.org/abs/1706.03762
    note: The transformer paper. Short, and readable once you have built the pieces.
  - title: The Illustrated Transformer
    author: Jay Alammar
    url: https://jalammar.github.io/illustrated-transformer/
    note: The clearest visual walkthrough of how attention moves information around.
  - title: Neural Networks and Deep Learning
    author: Michael Nielsen
    url: http://neuralnetworksanddeeplearning.com/
    note: Derives backpropagation from first principles, slowly and well.
  - title: Language Models are Unsupervised Multitask Learners
    author: Radford et al.
    url: https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf
    note: The GPT-2 paper - the architecture this project builds a small cousin of.
---
