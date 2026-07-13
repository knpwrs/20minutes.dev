---
project: build-an-autocomplete-engine
lesson: 19
title: The cache equals the scan
overview: A cache is only trustworthy if it always agrees with the slow, obviously-correct method. Today you prove the cached top-K equals a fresh brute-force scan for every prefix - even right after an insert that displaces a cached entry.
goal: Show that the cache-served Suggest matches a from-scratch brute-force ranking for every prefix, including after a displacing insert.
spec:
  scenario: The cached result matches the brute-force result
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cab", 2), Add("car", 5), Add("card", 7), Add("care", 3), Add("cat", 9)'
    - kw: When
      text: 'the cache-served Suggest("ca", 3) is compared to a brute-force scan-and-sort of the ca subtree taking the top 3'
    - kw: Then
      text: 'both return exactly ["cat", "card", "car"]'
    - kw: And
      text: 'after Add("caviar", 10) the cache still matches the brute force: Suggest("ca", 3) is ["caviar", "cat", "card"], caviar having displaced car from the cached top three'
code:
  lang: go
  source: |
    // A test-only oracle: recompute the answer the slow, obviously-correct way.
    func bruteForce(t *Trie, prefix string, k int) []string {
      cs := t.WeightedCompletions(prefix)
      sort.Slice(cs, func(i, j int) bool { return ranks(cs[i], cs[j]) })
      out := []string{}
      for i := 0; i < k && i < len(cs); i++ { out = append(out, cs[i].Term) }
      return out
    }
    // For several prefixes, assert Suggest(prefix, k) == bruteForce(t, prefix, k),
    // then Add a heavier term and assert they still agree.
checkpoint: The cached suggestions provably equal the brute-force ranking, before and after inserts. Commit and stop here.
---

Caches are where subtle bugs hide, so this lesson is pure verification: build a
`bruteForce` oracle that answers the query the slow but unarguable way - collect
the whole subtree, sort by the ranking order, take the top `k` - and assert that
the cached `Suggest` returns exactly the same list, for several prefixes. If they
ever diverge, the incremental cache maintenance in `Add` has a bug. There is
usually little or no new production code here; the work is writing the oracle and
the comparison, and that green result is the point.

The sharper test is **after an insert**. Adding `caviar` at weight 10 must ripple
into the cached top lists of every node on its path, pushing `car` out of the
cached top three under `ca`. If the cache still equals the brute force after that,
your `updateCache` is propagating correctly. This is the guarantee the whole
chapter was built to earn: a fast query that is never wrong, which the learning
features in the final chapter lean on every time a weight changes.
