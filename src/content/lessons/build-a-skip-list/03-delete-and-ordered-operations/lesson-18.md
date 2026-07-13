---
project: build-a-skip-list
lesson: 18
title: The ordered-set surface - contains, min, max
overview: With search and iteration in place, the everyday ordered-set queries fall out cheaply. Today you round out the public API with membership, the smallest key, and the largest key - and close the chapter with a genuinely useful ordered collection.
goal: Add Contains, Min, and Max, using level 0 for the minimum and the express lanes for the maximum.
spec:
  scenario: Membership and the extremes read straight off the structure
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9'
    - kw: When
      text: 'Contains, Min, and Max are queried'
    - kw: Then
      text: 'Contains(7) is true and Contains(6) is false; Min returns 1 and Max returns 9'
    - kw: And
      text: 'on a brand-new empty list Min and Max both return found false'
code:
  lang: go
  source: |
    func (s *SkipList) Contains(key int) bool { _, ok := s.Search(key); return ok }
    func (s *SkipList) Min() (int, bool) {
      if n := s.head.forward[0]; n != nil { return n.key, true }
      return 0, false
    }
    // Max: ride each express lane to its end, then take the last level-0 node.
checkpoint: The list is a working ordered set. This closes chapter three. Commit and stop here.
---

The smallest key is trivial: it is `head.forward[0]`, the very first node on the
bottom lane, since level 0 is sorted. The largest key is a nice mirror of search -
instead of stopping short of a target, you ride each express lane as far right as it
goes, dropping down when a lane ends, until you reach the final node on level 0. On a
tall list that finds the maximum in far fewer steps than walking every node.
`Contains` is just `Search` with the value thrown away, giving a clean boolean
membership test.

That completes the ordered-set surface: you can add and remove keys, test membership,
find the extremes, iterate in order, query a range, and round up to a successor - all
of it deterministic from a seed. What is still missing is the ability to ask about
**position**: what is the rank of a key, or which key sits at index k? Answering
those in better than linear time needs one more piece of bookkeeping on the forward
pointers, and that is what the final chapter builds.
