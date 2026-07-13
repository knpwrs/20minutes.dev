---
project: build-a-dns-resolver
lesson: 29
title: Iterative resolution
overview: Iterative resolution is the loop that starts at a root server and follows referrals down to the authoritative one. Today you wire that loop, asking each server in turn and descending on every referral until an answer arrives.
goal: Resolve a name by querying from the root and following referrals to the authoritative server.
spec:
  scenario: Resolution walks root to TLD to authoritative
  status: failing
  lines:
    - kw: Given
      text: 'a dial function giving a transport per server, where the root server refers to a .com server, the .com server refers to the authoritative server, and the authoritative server answers with an A record 93.184.216.34'
    - kw: When
      text: 'the resolver resolves "www.example.com" starting from the root server address'
    - kw: Then
      text: 'it queries root, then .com, then the authoritative server, and returns "93.184.216.34"'
    - kw: And
      text: 'each step uses the previous response: an answer ends the loop, a referral picks the next server via glue'
code:
  lang: go
  source: |
    // Resolver gains a `dial func(server string) Transport` field
    func (r *Resolver) resolve(name string) (string, error) {
      server := rootServer
      for i := 0; i < maxSteps; i++ {
        raw, _ := r.dial(server)(BuildQuery(nextID(), name))
        msg, _ := ParseMessage(raw)
        if a := findA(msg, name); a != "" { return a, nil } // done
        server, _ = nextServer(msg)                         // descend
      }
      return "", errResolutionFailed // ran out of steps
    }
checkpoint: The resolver walks the delegation from root to answer. Commit and stop here.
---

**Iterative resolution** is the algorithm that makes DNS a distributed system. You
start knowing only the **root** servers, and you walk down: ask the root for
`www.example.com`, and it refers you to the `.com` servers; ask a `.com` server, and
it refers you to `example.com`'s authoritative servers; ask one of those, and it
finally **answers** with the address. Each step reuses the referral reader from
lesson 28 to turn a reply into the next server to ask.

The loop is simple once the pieces exist: query the current server, and if the
reply has the answer you are done, otherwise follow its referral to the next server
and repeat. Route each reply through the `result` status check from lesson 26 first,
so a failing RCODE (a SERVFAIL or NXDOMAIN) ends the walk with an error instead of
being mistaken for "no answer, keep descending" - the capstone leans on exactly
that. Because each server is reached through the injectable transport (a
`dial(server)` that yields a `query` function), the entire root-to-authoritative
walk runs against **scripted** responses with no network at all - you can test the
real resolution algorithm deterministically. Cap the steps so a broken delegation
cannot loop forever. This is the heart of the resolver; the capstone drives it end
to end.
