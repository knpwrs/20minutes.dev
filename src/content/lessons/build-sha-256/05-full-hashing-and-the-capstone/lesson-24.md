---
project: build-sha-256
lesson: 24
title: HMAC-SHA256
overview: The right way to authenticate a message with a secret key is HMAC, which wraps your hash in two keyed passes to sidestep length extension. Today you build HMAC-SHA256 and match an official RFC 4231 vector.
goal: Build HMAC-SHA256 on top of your hash and match a published test vector.
spec:
  scenario: HMAC-SHA256 of a known key and message
  status: failing
  lines:
    - kw: Given
      text: 'a key K (shorter than 64 bytes) padded with zeros to the 64-byte block size, ipad = 0x36 repeated 64 times, and opad = 0x5c repeated 64 times'
    - kw: When
      text: 'HMAC(K, m) = Sum256((K XOR opad) || Sum256((K XOR ipad) || m)), where || is byte concatenation'
    - kw: Then
      text: "for K = \"Jefe\" and m = \"what do ya want for nothing?\", the HMAC hex is \"5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843\""
    - kw: And
      text: 'this matches RFC 4231 test case 2 exactly'
code:
  lang: go
  source: |
    // key shorter than 64 bytes is zero-padded on the right to 64 bytes
    // (a key longer than 64 bytes would first be replaced by Sum256(key))
    func HMAC(key, msg []byte) [32]uint8 {
      k := make([]byte, 64)
      copy(k, key)
      ipad := xorConst(k, 0x36)   // each of the 64 bytes XOR 0x36
      opad := xorConst(k, 0x5c)
      inner := Sum256(append(ipad, msg...))
      return Sum256(append(opad, inner[:]...))
    }
checkpoint: You can compute HMAC-SHA256 and match an RFC vector. Commit and stop here.
---

**HMAC** is the standard way to turn a hash into a keyed **message authentication
code** - a tag that proves a message came from someone who knows the secret key.
It exists because, as the last lesson showed, `Sum256(key || message)` is broken by
length extension. HMAC's fix is to hash **twice** with two different key-derived
pads: an inner hash of `(key XOR ipad) || message`, then an outer hash of
`(key XOR opad) || inner`. The extra outer pass means the attacker never sees a
hash state they can extend.

The mechanics: the key is first sized to the 64-byte block - zero-padded on the
right if short, or replaced by its own `Sum256` if longer than 64 bytes - then
XORed with the two fixed constants `ipad` (`0x36` repeated) and `opad` (`0x5c`
repeated). Everything else is just your existing `Sum256`, called twice. Pin RFC
4231's test case 2 (`key = "Jefe"`, message `"what do ya want for nothing?"`),
whose tag is `5bdcc146...64ec3843`. HMAC is what real systems use for signed
cookies, API request signing, and key derivation - all built on the hash you wrote.
