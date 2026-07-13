---
project: build-a-video-container-parser
lesson: 9
title: Recursing into containers
overview: Some boxes hold data and some hold other boxes. Today you split boxes into containers and leaves and recurse into the containers, turning the flat walk into the real box tree - and any box you do not recognise stays an opaque leaf.
goal: Build a box tree by recursing into container boxes and treating everything else as a leaf.
spec:
  scenario: Container boxes gain children; unknown boxes stay leaves
  status: failing
  lines:
    - kw: Given
      text: 'a buffer with a moov box nesting trak, then mdia, then a leaf hdlr, followed by an unknown box of type "xxxx"'
    - kw: When
      text: 'the buffer is parsed into a tree'
    - kw: Then
      text: 'moov has one child trak, trak has one child mdia, mdia has one child hdlr, and hdlr has no children'
    - kw: And
      text: 'the "xxxx" box is present as a top-level leaf with no children'
code:
  lang: go
  source: |
    // moov, trak, mdia, minf, stbl, dinf, udta are containers
    var containers = map[string]bool{"moov": true, "trak": true,
      "mdia": true, "minf": true, "stbl": true, "dinf": true, "udta": true}
    func parseTree(b []byte) []Box {
      boxes := parseBoxes(b)
      for i := range boxes {
        if containers[boxes[i].Type] {
          // recurse over this box's payload bytes into boxes[i].Children
        }
      }
      return boxes
    }
checkpoint: You can build the box tree. Commit and stop here.
---

Boxes come in two kinds. **Container** boxes (`moov`, `trak`, `mdia`, `minf`,
`stbl`, and a few others) have payloads that are themselves nothing but more boxes.
**Leaf** boxes (`ftyp`, `hdlr`, `mvhd`) hold actual fields. So the tree is built by
one rule: if a box is a container, parse its payload as boxes and attach them as
children; otherwise stop. Recursion falls out naturally - a container's children
may themselves be containers.

The other half of the rule is what makes a parser robust: a box whose type you do
**not** recognise is treated as an opaque **leaf**. You do not guess at its
contents - you keep it in the tree with no children and move on. That is why the
unknown `xxxx` box appears intact at the top level: unknown never means "fail," it
means "leaf." Malformed *sizes*, on the other hand, do need guarding - that is
tomorrow.
