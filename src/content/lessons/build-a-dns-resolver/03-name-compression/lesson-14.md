---
project: build-a-dns-resolver
lesson: 14
title: Partial compression and pointer chains
overview: A name can start with real labels and then finish with a pointer, and that pointer can lead to a name that itself ends in another pointer. Today you handle both - the general case where labels and pointers mix and chain.
goal: Decode a name made of leading labels followed by a pointer, including a chain of pointers.
spec:
  scenario: Labels then a pointer, following a chain, rebuild the full name
  status: failing
  lines:
    - kw: Given
      text: 'a message where offset 0 holds "com" (03 63 6f 6d 00), offset 5 holds "example" then a pointer to 0 (07 65 78 61 6d 70 6c 65 C0 00), and offset 15 holds "www" then a pointer to 5 (03 77 77 77 C0 05)'
    - kw: When
      text: 'a name is decoded starting at offset 15'
    - kw: Then
      text: 'the name is "www.example.com" (www, then the pointer to example, whose pointer leads to com)'
    - kw: And
      text: 'decoding at offset 5 gives "example.com" with 10 bytes consumed'
code:
  lang: go
  source: |
    // accumulate leading labels, then when a pointer appears follow it
    // and append the name it yields - which may itself follow more pointers
    for b[i] != 0 {
      if isPointer(b[i]) {
        rest, _ := decodeName(b, pointerTarget(b[i], b[i+1]))
        labels = append(labels, rest)
        break
      }
      // read a normal label and continue
    }
checkpoint: You can decode mixed label-and-pointer names and chains. Commit and stop here.
---

Real compression is rarely a bare pointer. More often a name is a few fresh
**labels followed by a pointer** to a shared suffix - `www` written out, then a
pointer to an `example.com` that appeared earlier. And that earlier name may itself
end in a pointer, forming a **chain**: `www` points to `example` which points to
`com`. Your decoder handles this naturally if it accumulates leading labels
normally and, the moment it meets a pointer, follows it and appends whatever full
name comes back - recursion does the chaining for you.

The consumed length still counts only the bytes at the **starting** offset: at
offset 15 you read `www` (four bytes) plus the two pointer bytes, so six bytes were
spent there regardless of how far the chain wanders. Decoding partway into the
chain, at offset 5, gives `example.com` because the `example` labels are followed
by a pointer to `com`. This mixed case is what nearly every compressed name in a
real response looks like, so getting it right makes the record parsing ahead
straightforward.
