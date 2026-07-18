---
project: build-a-tts-model
lesson: 9
title: Expanding abbreviations
overview: 'Text still holds shorthand like "dr." that nobody actually says that way aloud. Today you expand a small table of common abbreviations, then reduce the sentence to bare word tokens ready for a dictionary lookup.'
goal: 'Expand a fixed table of abbreviations by exact word match, then reduce the sentence to bare, lookup-ready word tokens.'
spec:
  scenario: Expanding abbreviations and tokenizing
  status: failing
  lines:
    - kw: Given
      text: 'the sentence "dr. smith has twenty cats." and an abbreviation table mapping "dr." to "doctor"'
    - kw: When
      text: abbreviations are expanded by exact word match
    - kw: Then
      text: 'the result is exactly "doctor smith has twenty cats." - only the abbreviated word changes'
    - kw: When
      text: the expanded sentence is tokenized, stripping residual punctuation from each word
    - kw: Then
      text: 'the tokens are exactly doctor, smith, has, twenty and cats - five bare words, with the trailing period stripped from the last one'
code:
  lang: go
  source: |
    // exact whole-word match against a fixed map; words not in the map pass through unchanged
    if full, ok := abbreviations[w]; ok {
      words[i] = full
    }
    // tokenize: split on spaces, then trim residual punctuation from each word
checkpoint: 'Sentences are now bare word tokens, free of abbreviations and punctuation, ready for a dictionary lookup. Commit and stop for today.'
---

"Dr." is not a word - it is two letters and a period standing in for
"doctor", and a listener hears the whole word, not the abbreviation. The fix
is a small, fixed lookup table: a handful of common abbreviations like
"dr.", "mr." and "st." mapped to what they actually stand for, checked
against each word exactly as normalization left it, period included.

Once abbreviations are expanded, the punctuation that made them recognizable
has done its job and can go. Stripping the residual periods and commas from
each word turns the sentence into bare tokens - "doctor", "smith", "has",
"twenty", "cats" - the exact shape a pronunciation lexicon expects a word to
arrive in. This closes out the text-cleanup pipeline: normalize, expand
numbers, expand abbreviations, tokenize.
