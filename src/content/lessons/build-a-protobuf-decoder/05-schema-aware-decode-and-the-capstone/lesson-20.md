---
project: build-a-protobuf-decoder
lesson: 20
title: Proto3 default values
overview: In proto3 an absent scalar field is not missing, it takes a well-defined default, and the decoder must fill those in. Today you make a field that never appeared decode to its type's zero value.
goal: Fill absent scalar fields with their proto3 default values.
spec:
  scenario: An absent field decodes to its default
  status: failing
  lines:
    - kw: Given
      text: 'a descriptor with field 1 "name" string, field 2 "age" int32, and field 3 "active" bool'
    - kw: And
      text: 'a message containing only field 1 with the string "Bob" (bytes 0x0A, 0x03, 0x42, 0x6F, 0x62)'
    - kw: When
      text: 'the message is decoded'
    - kw: Then
      text: 'name is "Bob", age is 0, and active is false'
    - kw: And
      text: 'the defaults are the type zero values: 0 for numbers, false for bool, the empty string for string'
code:
  lang: go
  source: |
    // after filling fields that appeared, add defaults for the rest
    func applyDefaults(d Descriptor, out map[string]any) {
      for _, fd := range d {
        if _, present := out[fd.Name]; present { continue }
        // out[fd.Name] = zero value for fd.Type: 0, false, "", etc.
      }
    }
checkpoint: Absent fields decode to their proto3 defaults. Commit and stop here.
---

Proto3 dropped the notion of an explicitly set field for scalars: on the wire, a
scalar equal to its default is simply **not written at all**. So the decoder cannot
treat "absent" as "unknown" - it must supply the **default value**, which for every
proto3 scalar is the type's zero: `0` for the integer and floating types, `false`
for `bool`, the empty string for `string`, empty bytes for `bytes`, and the zero
enum value. A message that carries only `name` still has an `age` and an `active`;
they are 0 and false.

This is why proto3 encoders omit default-valued fields to save space, and why two
messages can be equal even though one wrote a field and the other did not. Fill
defaults after placing the fields that actually appeared, so a present value is
never overwritten. Getting this right is what makes the round-trip in a couple of
lessons behave: encode drops defaults, decode puts them back, and the structured
value is unchanged.
