---
project: build-an-agent-harness
lesson: 28
title: Estimating the transcript's size
overview: Knowing roughly how big a transcript is, without a network call, means budgeting for it before you ever send it. Today you build that estimate from byte length, not character count.
goal: Build a token estimator that counts bytes, not characters, so multibyte text costs more of the budget the way it actually should.
spec:
  scenario: Estimating tokens from bytes, not characters
  status: failing
  lines:
    - kw: Given
      text: 'the ASCII string "The quick brown fox jumps over the lazy dog." - 44 bytes long, and also 44 characters long - and the string "café ☕ 日本語" - 19 bytes long but only 10 characters'
    - kw: When
      text: each string is run through the token estimator
    - kw: Then
      text: 'the ASCII string estimates to 11 tokens - 44 bytes divided by 4, exactly'
    - kw: And
      text: 'the multibyte string estimates to 5 tokens - 19 bytes divided by 4, rounded up - not a number derived from its 10 characters'
code:
  lang: go
  source: |
    // bytes, not characters - a multibyte character costs more of the budget
    func EstimateTokens(s string) int {
        n := len(s) // byte length
        return (n + 3) / 4 // ceil(n / 4)
    }
checkpoint: You can now estimate how much of the token budget a piece of text costs, without any network call, and know exactly why multibyte text costs more of it. Commit and stop for today.
---

Before sending a transcript, it helps to know roughly how big it is - close to a budget limit, or nowhere near one. The real, exact count comes from the API's own `count_tokens` endpoint, but that needs a network round trip for a number you often just want as a quick local check. So this lesson builds a rough estimate instead: **one token per four bytes, rounded up.**

The detail that matters is *bytes*, not characters. `"café ☕ 日本語"` is 10 characters but 19 bytes, because `é`, `☕`, and each character of `日本語` all take more than one byte in UTF-8 - and the estimate has to key off the byte count to avoid under-charging exactly the non-English text a character count would flatter. Be honest about what this number is for: it is a rough client-side budgeting figure, not a promise about what the API will actually bill you for.
