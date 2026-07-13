---
project: build-an-autocomplete-engine
lesson: 21
title: Recording an unknown term
overview: Sometimes a user selects something the engine has never seen - a query it should learn from scratch. Today you let Record add a brand-new term on the fly with a starting weight.
goal: Let Record insert a previously unknown term with an initial weight of 1, so it becomes a suggestion.
spec:
  scenario: Recording a new term adds it
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("car", 7) and Add("cat", 5), with Len() 2'
    - kw: When
      text: 'Record("cab") is called and cab was never added'
    - kw: Then
      text: 'Weight("cab") is 1, Len() is 3, and Suggest("ca", 3) returns ["car", "cat", "cab"]'
    - kw: And
      text: 'a second Record("cab") raises Weight("cab") to 2 without changing Len()'
code:
  lang: go
  source: |
    // In Record, create missing children as you walk (like Add), then:
    if !cur.end {
      cur.end = true
      t.size++
      cur.weight = 1 // a first selection starts a new term at weight 1
    } else {
      cur.weight++
    }
    for _, n := range path {
      updateCache(n, term, cur.weight)
    }
checkpoint: Record can learn a brand-new term, starting it at weight 1. Commit and stop here.
---

A real typeahead cannot only know words it was seeded with - people search for new
things, and the first time someone selects one, the engine should start tracking
it. So `Record` gains the ability to **create** a term: walking the path, it makes
any missing child nodes just as `Add` does, and if the final node did not already
end a word, it marks it, counts it, and gives it a starting weight of `1`. From
then on it is an ordinary term that further selections bump.

This unifies the two ways a term's weight grows: an existing term is incremented,
a new one is born at `1`, and both paths finish by updating the caches so the term
appears in suggestions immediately. `cab` was never added, but one `Record("cab")`
makes it a real completion of `ca`, ranked last at weight 1; a second selection
takes it to 2. Learning and discovery now run through the same small method.
