---
title: 'Build a Protobuf Decoder'
order: 47
lessons: 25
size: 'Small'
tech: ['Protocol Buffers', 'Varints', 'Wire formats']
estMin: 20
desc: 'Build a real Protocol Buffers codec from the wire format up, decoding raw protobuf bytes into structured fields and encoding them back, with no generated code and no .proto compiler. Start with base-128 varints, then tags and the four wire types, the scalar family (varint ints, zigzag sints, little-endian fixed32 and fixed64, length-delimited strings and bytes), nested messages, repeated and packed fields, and finally a schema-aware decode into named fields with proto3 defaults and preserved unknown fields, ending in a library that round-trips a real message byte for byte.'
blurb: 'Decode protobuf by hand so every step is an exact byte you can assert against: a varint 150 is 0x96 0x01, a tag for field 1 length-delimited is 0x0A, zigzag maps -1 to 1 and -2 to 3, a fixed32 is four little-endian bytes, a nested message recurses, a packed repeated list unpacks from one length-delimited chunk, an absent field takes its proto3 default, and an unknown field number is preserved as raw wire bytes. Every lesson is one concrete spec with real bytes in and structured values out.'
overview: |
  Over 25 lessons you build a working Protocol Buffers codec from the wire format up: a library that decodes raw protobuf bytes into structured fields and encodes them back, byte for byte. There is no generated code and no .proto compiler anywhere in the project. You read and write the bytes yourself, so every step is a concrete value you can assert against and the same code works in any language.

  You start with base-128 varints, the variable-length integers at the heart of the format, decoding and encoding them and pinning the truncated and over-long error cases. Then come tags and the four wire types, the scalar family (varint-encoded integers, zigzag for signed values, little-endian fixed32 and fixed64, and length-delimited strings and bytes), nested messages that recurse, and repeated and packed fields. The final chapter adds a tiny descriptor so you can decode into named fields with proto3 default values, preserve unknown fields as raw wire bytes, resolve last-one-wins for duplicated scalars, and round-trip a real message back to equivalent bytes.

  This is a teaching-grade codec focused squarely on the proto3 binary wire format, and it is honest about its edges: it never generates code from a .proto file (you supply a tiny descriptor by hand), it covers the four current wire types but not the deprecated start-group and end-group types, and it does not implement maps, oneof, services, or proto2-only semantics as distinct concepts, since those all reduce to the wire-format primitives you build here. The result is a real decoder and encoder for the format that Google, gRPC, and countless systems move data with every day.
parts:
  - name: 'Varints, the core'
    count: 5
  - name: 'Tags and wire types'
    count: 4
  - name: 'Scalar values'
    count: 5
  - name: 'Messages, repeated, and packed'
    count: 4
  - name: 'Schema-aware decode and the capstone'
    count: 7
caveats:
  note: 'The codec correctly decodes and encodes every proto3 scalar type, nested messages, and packed and unpacked repeated fields, with proto3 defaults and unknown-field preservation and a byte-for-byte round-trip, but it trusts a hand-built descriptor rather than validating wire types against it, and it has no maps, oneof, groups, or .proto-file parsing.'
  future:
    - 'Cross-check each field''s actual wire type against the descriptor''s declared type and error on a mismatch instead of silently reinterpreting the bits'
    - 'Add map<K,V> support by modelling a map entry as a schema-aware repeated {key, value} message pair'
    - 'Add oneof support so setting one field in a group clears any previously decoded sibling from that group'
    - 'Parse .proto files (or a binary FileDescriptorProto) into a descriptor instead of hand-writing the field map in code'
    - 'Accept a streaming byte reader instead of requiring the whole message buffered in memory'
    - 'Add reflection-based marshal and unmarshal driven by struct tags so callers do not maintain a parallel descriptor by hand'
resources:
  - title: 'Protocol Buffers: Encoding'
    url: 'https://protobuf.dev/programming-guides/encoding/'
    note: 'The canonical specification of the binary wire format: base-128 varints, the field tag, the four wire types, zigzag for signed integers, length-delimited values, packed repeated fields, and the exact worked examples (150 is 0x96 0x01) this project pins.'
  - title: 'Protocol Buffers: Language Guide (proto3)'
    url: 'https://protobuf.dev/programming-guides/proto3/'
    note: 'The .proto schema language that names field numbers and types: scalar types, defaults, enums, repeated and packed, oneof, and maps. The descriptor you hand-build in the final chapter is a tiny slice of what this guide formalizes.'
  - title: 'Let''s make a Varint'
    author: 'Carl Mastrangelo'
    url: 'https://carlmastrangelo.com/blog/lets-make-a-varint'
    note: 'A focused deep dive on the variable-length integer that underlies everything in protobuf: why seven payload bits and a continuation bit, little-endian group order, and how the encoding trades bytes for range.'
  - title: 'Protocol Buffers Overview'
    url: 'https://protobuf.dev/overview/'
    note: 'The why behind the format: a compact, schema-driven, forward and backward compatible serialization, and how unknown-field preservation and defaults make old and new code interoperate. Useful context for the schema-aware chapter.'
  - title: 'MessagePack specification'
    url: 'https://github.com/msgpack/msgpack/blob/master/spec.md'
    note: 'A worthwhile comparison: MessagePack is a schema-less, self-describing binary format where each value carries a type byte, whereas protobuf is schema-driven and encodes only field numbers and wire types. Reading both clarifies what a descriptor buys you and what it costs.'
---
