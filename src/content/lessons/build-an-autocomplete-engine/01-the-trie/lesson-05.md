---
project: build-an-autocomplete-engine
lesson: 5
title: Counting distinct words
overview: The engine should know how many distinct words it holds, and that count must not double-count a word inserted twice. Today you make Len exact by only counting a word the first time its end marker flips on.
goal: Track the number of distinct stored words, counting each word exactly once.
spec:
  scenario: Len counts distinct words, ignoring duplicates
  status: failing
  lines:
    - kw: Given
      text: 'a new trie'
    - kw: When
      text: 'Insert("car"), Insert("cart"), Insert("care") are called'
    - kw: Then
      text: 'Len() is 3'
    - kw: And
      text: 'a further Insert("car") leaves Len() at 3, while Insert("cab") raises it to 4'
code:
  lang: go
  source: |
    func (t *Trie) Insert(word string) {
      cur := t.root
      for _, r := range word {
        // ... walk/create children as before ...
      }
      if !cur.end { // only a NEWLY ended word bumps the count
        cur.end = true
        t.size++
      }
    }
checkpoint: Len reports the number of distinct stored words and never double-counts. Commit and stop here.
---

The word count lives on the `Trie` as `size`, but the trick is updating it
correctly. Marking `end` unconditionally would let a repeated `Insert("car")`
inflate the count even though no new word arrived. So guard it: only when the
final node's `end` was **false** before this insert has a genuinely new word been
added, and only then do you flip `end` and increment `size`.

Inserting `car`, `cart`, `care` adds three distinct words, so `Len()` is 3.
Inserting `car` a fourth time finds an already-ended node and changes nothing;
inserting `cab` ends a new node and takes the count to 4. This exact-count
guarantee is what lets later lessons trust that "return everything" really means
every stored word, once each.
