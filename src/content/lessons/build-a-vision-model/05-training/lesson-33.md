---
project: build-a-vision-model
lesson: 33
title: Measuring accuracy
overview: Loss is a training signal, not a scoreboard. Today you measure the number a human actually cares about - how many predictions are simply correct.
goal: Measure accuracy of the network from lesson 32 across the full 8-sample dataset, and explain why it comes out perfect.
spec:
  scenario: Measuring accuracy across the training set
  status: failing
  lines:
    - kw: Given
      text: 'the network from lesson 32 after its 30 training steps, and the full 8-sample dataset from lesson 29'
    - kw: When
      text: 'accuracy is measured - for every sample, take the class with the higher of the two probabilities as the prediction, and divide the count of correct predictions by the total sample count'
    - kw: Then
      text: 'the accuracy is 100 percent - all 8 predictions match their true label'
    - kw: And
      text: 'no single probability approaches certainty - the strongest is sample i=4 at about 0.73979 for its correct class, and the weakest is sample i=5 at about 0.53928, still clearly over 0.5 but far from saturated'
    - kw: And
      text: 'channel 0''s kernel (rows 0.1, 0, -0.1) computes a left-column-sum minus right-column-sum for every 3x3 window; that difference is exactly 0 for every horizontal-edge sample, since a horizontal edge''s value never changes across columns, and strictly nonzero for every vertical-edge sample, since a vertical edge is defined by exactly that column threshold - which is why this network separates the two classes without a single error'
code:
  lang: go
  source: |
    // prediction = whichever class has the higher probability
    func predict(p []float64) int {
      if p[1] > p[0] {
        return 1
      }
      return 0
    }
    // accuracy = count of predict(p) == trueLabel, divided by total samples
checkpoint: You can measure whether the network is actually right, not just watch its loss fall, and have a concrete structural reason why this particular network gets every training sample correct. Commit and stop for today.
---

Loss is what training pushes down, but it is not the number anyone actually wants to know. **Accuracy** answers the real question directly: take the class each sample's probabilities favour, compare it to the true label, and report the fraction that match. It throws away exactly how confident each prediction was and keeps only whether it was right.

100 percent on 8 samples after just 30 steps sounds suspicious, so it is worth explaining rather than just reporting. Channel 0's kernel is a column-difference detector: subtract the right third of every 3x3 window from the left third. A horizontal edge holds the same value across every column within any window, so that difference is always exactly 0. A vertical edge is defined by a column threshold, so the two columns almost never agree - the difference comes out nonzero every time. That single channel alone is enough to separate the two classes perfectly, which is why perfect accuracy shows up this early. It is also worth noticing what perfect accuracy is not: every probability above sits well clear of 0.5, but the weakest is only 0.539 - a real margin, not a saturated one.
