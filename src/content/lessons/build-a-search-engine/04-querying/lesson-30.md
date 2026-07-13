---
project: build-a-search-engine
lesson: 30
title: Parsing boolean queries
overview: Today you read a boolean query like "cats AND dogs" into a token stream where operators are recognized and the words between them are analyzed into terms. This is the parse step before boolean evaluation.
goal: Parse a boolean query string into a list of analyzed terms and AND/OR/NOT operators.
spec:
  scenario: Splitting a boolean query into terms and operators
  status: failing
  lines:
    - kw: Given
      text: 'the boolean query "Cats AND dogs"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the tokens are ["cat", "AND", "dog"]'
    - kw: And
      text: '"cat OR NOT bird" parses to ["cat", "OR", "NOT", "bird"]'
code:
  lang: python
  source: |
    OPS = {"AND", "OR", "NOT"}
    def parse_bool(query):
        out = []
        for word in query.split():
            if word.upper() in OPS:
                out.append(word.upper())
            else:
                out.extend(analyze(word))   # a term becomes its analyzed form
        return out
reading: 'Manning, Introduction to Information Retrieval - ch. 1.3.'
checkpoint: A boolean query string becomes a stream of terms and operators. Commit and stop here.
---

So far queries have been bags of words. A **boolean query** adds structure with the
operators `AND`, `OR`, and `NOT`. Before you can evaluate one, you have to parse it:
walk the whitespace-separated words, recognize the three operators (in any case),
and analyze everything else into a term - so `Cats` becomes `cat`, matching the
index.

Keep the operators uppercase and the terms analyzed, and you get a clean token
stream like `["cat", "AND", "dog"]`. This flat list is enough for the
left-to-right evaluation you will write tomorrow; a production parser would build a
tree with precedence, but the token stream keeps the idea in view without the
machinery.
