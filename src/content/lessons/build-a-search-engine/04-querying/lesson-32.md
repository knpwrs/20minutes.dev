---
project: build-a-search-engine
lesson: 32
title: Phrase queries
overview: Today you answer phrase queries - "quick brown" should match only documents where those words are adjacent, in order. The positions you stored back in the index chapter are what make this possible.
goal: Match a phrase by finding documents where the query terms occur at consecutive positions in order.
spec:
  scenario: Matching adjacent, in-order terms
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "the quick brown fox") and ("d2", "brown quick") added'
    - kw: When
      text: 'you run the phrase query ["quick", "brown"]'
    - kw: Then
      text: 'it matches ["d1"], where "quick" is immediately followed by "brown"'
    - kw: And
      text: 'the phrase ["quick", "fox"] matches nothing - they are not adjacent'
code:
  lang: python
  source: |
    # a doc matches if some position p has term[0] at p, term[1] at p+1, ...
    def phrase(self, terms):
        out = []
        for d in candidates_with_all_terms:
            starts = self.positions(terms[0], d)
            if any(all(p + i in set(self.positions(terms[i], d))
                       for i in range(len(terms))) for p in starts):
                out.append(d)
        return out
reading: 'Manning, Introduction to Information Retrieval - ch. 2.4.2.'
checkpoint: Phrase queries match only truly adjacent terms. Commit and stop here.
---

A bag-of-words query for `quick brown` matches a document that has both words
anywhere. A **phrase query** is stricter: the words must be adjacent and in order.
This is exactly what the positional index was built for. A document matches if there
is some position `p` where the first term sits at `p`, the second at `p + 1`, and so
on down the phrase.

First narrow to documents containing every term at all - a phrase can only occur
where all its words do - then check positions only there. In `the quick brown fox`,
`quick` at `1` is followed by `brown` at `2`, so it matches; `quick` and `fox` sit
at `1` and `3`, not adjacent, so that phrase fails. Reversed order like `brown
quick` fails too, which is what makes it a *phrase*.
