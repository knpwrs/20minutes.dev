---
project: build-a-json-parser
lesson: 27
title: Serializing objects
overview: Objects are the last kind to serialize - key-value members joined by commas, with each key written as a quoted string. Today you complete the compact serializer.
goal: Serialize an object value as a compact list of quoted-key, value members in stored order.
spec:
  scenario: Writing objects as text
  status: failing
  lines:
    - kw: Given
      text: 'an object Value'
    - kw: When
      text: 'Serialize is called'
    - kw: Then
      text: 'an empty object is "{}", and the object with members a then b holding Number 1 and 2 serializes to {"a":1,"b":2}'
    - kw: And
      text: 'members keep their stored order and each key is escaped as a string, so a member key a with a Number 1 nested array value {"a":[1]} serializes to {"a":[1]}'
code:
  lang: go
  source: |
    // object case of Serialize:
    //   '{' + join(serializeString(m.Key)+":"+Serialize(m.Value), ",") + '}'
    // reuse the string escaper for the key; no spaces around ':' or ','
    // iterate members in their stored order
checkpoint: The compact serializer is complete for every value kind. Commit and stop here.
---

An object serializes like an array, with one twist per member: each **member** is a
quoted key, a colon, and the serialized value. Reuse the string serializer from two
lessons ago for the key so that keys needing escapes are handled correctly. Members
are separated by commas, with no spaces around the colon or the comma in compact
form, and the empty object is `{}`.

Crucially, emit members in their **stored order** - the order the parser preserved -
rather than sorting or randomizing them. That makes serialization deterministic and,
for a document that was parsed from canonical text, an exact inverse of parsing.
With objects done, `Serialize` covers all six value kinds, and every value tree can
now be written back to text. The next lesson proves it forms a clean round-trip.
