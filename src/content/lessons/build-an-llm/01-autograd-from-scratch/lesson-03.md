---
project: build-an-llm
lesson: 3
title: Multiplying two values
overview: 'Multiplication is the graph''s second edge, and the one that will need its own gradient rule later. Today you build only its forward half.'
goal: Build a Mul function that returns a new Value holding the product, recording the two inputs as its children.
spec:
  scenario: Multiplying two leaf values
  status: failing
  lines:
    - kw: Given
      text: 'a=2.0 and b=-3.0'
    - kw: When
      text: 'c is built by multiplying a and b'
    - kw: Then
      text: 'c.Data is -6.0'
    - kw: And
      text: 'c records a and b as its children, in that order'
    - kw: And
      text: 'c is marked as the result of a multiplication, distinguishing it from an addition'
code:
  lang: go
  source: |
    // same shape as Add - only the forward arithmetic and the op label
    // differ; the backward closure is still missing on purpose
    func Mul(a, b *Value) *Value {
      return &Value{
        Data:     a.Data * b.Data,
        children: []*Value{a, b},
        op:       "*",
      }
    }
checkpoint: A second operation builds graph edges the same way the first one did - the pattern for wiring in any new op is now established. Commit and stop for today.
---

`Mul` sits right next to `Add`: same two children recorded, same shape of result, only the arithmetic and the label differ. Building it separately rather than reusing `Add` with a flag matters for what comes next - addition and multiplication have genuinely different backward rules, and giving each operation its own function is what lets each one carry its own closure later without a tangle of conditionals.

It is worth noticing what stays constant across every operation you will ever add to this engine: compute the forward result, record the children that produced it, label the operation, and stop. That four-step shape is the entire contract a new op has to satisfy, and multiplication is proof that the contract is enough for more than one kind of arithmetic. The product rule - and the fact that multiplication's backward pass needs to look at *both* operands' data, unlike addition's - is still a lesson away.
