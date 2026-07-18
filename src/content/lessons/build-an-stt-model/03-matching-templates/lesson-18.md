---
project: build-an-stt-model
lesson: 18
title: Isolated-word recognition
overview: A DTW total cost is a distance between a test utterance and any one reference template, and recognizing an isolated word is nothing more than trying every template and keeping whichever one scores lowest.
goal: Score a test sequence against two candidate word templates with lesson 17's DTW and pick the lower-cost match.
spec:
  scenario: Recognizing the closer of two word templates
  status: failing
  lines:
    - kw: Given
      text: 'a test sequence [1, 2, 4, 4, 5], and two candidate word templates: word A = [1, 3, 4, 5] and word B = [5, 4, 3, 1]'
    - kw: When
      text: 'the DTW total cost is computed between the test sequence and each template'
    - kw: Then
      text: 'the cost against word A is 1.0 - the same total lesson 16 and 17 already computed'
    - kw: And
      text: 'the cost against word B is 37.0'
    - kw: And
      text: 'word A is recognized, because its cost is the lower of the two'
code:
  lang: go
  source: |
    // try every candidate template, keep whichever gives the lowest DTW
    // total cost against the test sequence (however you already compute that)
    func Recognize(test []float64, templates map[string][]float64) string {
      best, bestCost := "", math.Inf(1)
      for name, tmpl := range templates {
        if c := DTWTotalCost(tmpl, test); c < bestCost {
          best, bestCost = name, c
        }
      }
      return best
    }
checkpoint: Your first isolated-word recognizer works - given any test utterance and a handful of templates, it names the closest one. Commit and stop for today.
---

Every idea this chapter has built so far - the distance, the cost matrix, the backtracked path - was really in service of one number: the total cost of aligning a test sequence to a reference. Recognizing an **isolated word** just means computing that one number against every word you know, and reporting whichever template it was cheapest to explain the test sequence with.

Word B is a deliberately bad match here - it runs in the opposite direction from the test sequence, so DTW has to pay dearly to align a falling reference against a rising test. That is not a coincidence: DTW tolerates a word being spoken faster, slower, or with pauses in different places, but it cannot rescue a fundamentally different shape, and a cost of 37 against a cost of 1 makes that gap impossible to miss.
