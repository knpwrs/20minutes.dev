---
project: build-an-agent-harness
lesson: 31
title: Proving the cache hit
overview: A caching request looks identical whether or not it actually hit the cache - the reply reads the same either way. Today you build the one check that tells hit from miss - the usage numbers.
goal: Build CacheHitProven so it reads true only when a response's usage reports tokens read from the cache.
spec:
  scenario: Reading usage to tell a cache write from a cache hit
  status: failing
  lines:
    - kw: Given
      text: 'two usage reports from calls that both use the same cached system prompt - the first reporting 12 input tokens, 30 output tokens, 210 cache_creation_input_tokens, and 0 cache_read_input_tokens'
    - kw: And
      text: 'the second reporting 12 input tokens, 18 output tokens, 0 cache_creation_input_tokens, and 210 cache_read_input_tokens'
    - kw: When
      text: 'each usage is checked for whether it proves a cache hit'
    - kw: Then
      text: 'the first does not prove a hit - it wrote 210 tokens into the cache and read back none'
    - kw: And
      text: 'the second does prove a hit - it read all 210 tokens back from the cache and wrote none itself'
code:
  lang: go
  source: |
    // the only signal that matters: did this call READ from the cache?
    func CacheHitProven(u Usage) bool {
        return u.CacheReadInputTokens > 0
    }
checkpoint: You can tell, from the usage numbers alone, whether a request actually reused a cached prefix or paid to write it fresh. Commit and stop for today.
---

Marking a block with `cache_control` does not, by itself, tell you whether caching actually did anything. The reply's text reads the same, `stop_reason` is whatever it always is, and nothing about the visible conversation changes between a request that wrote a fresh cache entry and one that reused it. If you want proof, you have to look somewhere else entirely: `usage`.

Two fields carry the truth. `cache_creation_input_tokens` is nonzero on the call that pays to write the prefix into the cache for the first time; `cache_read_input_tokens` is nonzero on a later call that got to skip that cost because the prefix was still there. A genuine hit is exactly `cache_read_input_tokens > 0` - nothing about the reply itself proves it, only this one number does. That is worth sitting with today, because it is the rare case in this project where the answer to "did my optimisation work" cannot be eyeballed at all.
