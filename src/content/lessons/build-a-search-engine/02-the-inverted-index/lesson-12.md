---
project: build-a-search-engine
lesson: 12
title: Document frequency
overview: Today you count how many documents contain a term - its document frequency. Rare terms are more informative than common ones, and this count is what makes that idea measurable.
goal: Report the document frequency of a term across the whole index.
spec:
  scenario: Counting documents per term
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cat dog") and ("d2", "dog") added'
    - kw: When
      text: you ask for document frequencies
    - kw: Then
      text: 'df("dog") is 2 and df("cat") is 1'
    - kw: And
      text: 'df for a term not in the index is 0'
code:
  lang: python
  source: |
    def df(self, term):
        # how many documents contain the term at all
        return len(self.postings(term))
reading: 'Manning, Introduction to Information Retrieval - ch. 6.2.1.'
checkpoint: The index reports how many documents each term appears in. Commit and stop here.
---

Term frequency counts occurrences *within* one document. **Document frequency**
(df) counts something different: across the whole index, how many documents
contain the term at least once. The word `the` might have a huge document
frequency, while `photosynthesis` has a tiny one.

That contrast is the whole point. A term that appears in few documents is a strong
discriminator - matching it narrows the field sharply - while a term in nearly
every document barely narrows anything. Because your postings lists already hold
exactly the set of documents per term, document frequency falls out as their
length. Tomorrow's positions and next chapter's `idf` both build on this.
