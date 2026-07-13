---
project: build-a-skip-list
lesson: 1
title: The node and its tower
overview: A skip list is built from nodes, and the one thing that makes a skip-list node special is its tower - a stack of forward pointers, one per level. Today you build that node so every later lesson has something to link together.
goal: Create a node holding a key, a value, and a tower of a chosen height with every forward pointer empty.
spec:
  scenario: A new node has a key, a value, and an empty tower of the given height
  status: failing
  lines:
    - kw: Given
      text: 'a node created with newNode(5, 50, 3)'
    - kw: When
      text: 'its key, value, and tower are inspected'
    - kw: Then
      text: 'the key is 5, the value is 50, the tower has 3 levels, and every forward pointer is empty'
    - kw: And
      text: 'a node created with newNode(9, 90, 1) has a tower of exactly 1 level, also empty'
code:
  lang: go
  source: |
    // forward[i] is this node's successor at level i; a tower of `height`
    // levels starts out entirely unlinked (every pointer nil).
    type node struct {
      key, val int
      forward  []*node
    }
    func newNode(key, val, height int) *node {
      return &node{key: key, val: val, forward: make([]*node, height)}
    }
checkpoint: You have a skip-list node with a key, a value, and an empty tower. Commit and stop here.
---

Every node in a skip list carries the usual key and value, plus the one idea the
whole data structure is built on: a **tower** of forward pointers. `forward[0]` is
the node's successor on the bottom level, where every node lives; `forward[1]` is
its successor on the level above (an express lane that skips some nodes), and so on
up the tower. A node's **height** is how many levels its tower has.

Today is deliberately tiny: a node that knows its key, its value, and holds a tower
of a given height with every pointer still empty. The heights will later be chosen
at random - that randomness is what balances the list - but the node itself does not
care how tall it is. Getting this shape right is where everything starts, because
the next lesson strings these towers together behind a sentinel to form the list.
