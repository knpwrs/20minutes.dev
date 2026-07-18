---
project: build-a-tts-model
lesson: 7
title: Normalizing text
overview: 'Real input text arrives with stray capitalization and repeated whitespace that have nothing to do with what a listener hears. Today you fold both away, leaving punctuation in place for the lessons that still need it.'
goal: 'Normalize raw text to lowercase with single spaces between words, trimmed at both ends.'
spec:
  scenario: Normalizing raw input text
  status: failing
  lines:
    - kw: Given
      text: 'the raw text "  Dr.   Smith  has 20 Cats.  " - mixed case, doubled internal spaces, and leading and trailing whitespace'
    - kw: When
      text: the text is normalized
    - kw: Then
      text: 'the result is exactly "dr. smith has 20 cats." - lowercase, single spaces between words, and no leading or trailing whitespace'
    - kw: And
      text: 'the trailing period after "cats" is still there - punctuation is left in place, since later lessons still need it'
code:
  lang: go
  source: |
    // lowercase, then split on any whitespace and rejoin with single spaces
    s = strings.ToLower(s)
    fields := strings.Fields(s)
    return strings.Join(fields, " ")
checkpoint: 'Every downstream stage can now assume clean, consistently spaced lowercase text. Commit and stop for today.'
---

Case and spacing carry no information about how a sentence sounds - "Dr." and
"dr." say the same word, and three spaces between two words are heard no
differently from one. So the first stage of turning text into speech is not
about sound at all: it is throwing away the variation that does not matter,
before anything downstream has to deal with it.

Notice what normalization deliberately keeps: the period after "cats." stays
exactly where it is. Punctuation looks like noise, but it is not - lesson 9
needs the period on "Dr." to recognize it as an abbreviation rather than a
word, and a sentence-ending period will eventually matter for phrasing too.
Today's job is narrower than "clean the text up": collapse whitespace, fold
case, and stop there.
