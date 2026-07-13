---
project: build-a-dns-resolver
lesson: 27
title: Following a CNAME chain
overview: When a name is an alias, the answer is a CNAME pointing at another name you must look up in turn. Today you follow that chain through the transport until you reach the address.
goal: Resolve a name that is a CNAME by re-querying its target until an A record is found.
spec:
  scenario: A CNAME answer is chased to its address
  status: failing
  lines:
    - kw: Given
      text: 'a scripted transport where querying "www.example.com" returns a CNAME answer pointing to "target.example.net", and querying "target.example.net" returns an A record 203.0.113.5'
    - kw: When
      text: 'the resolver looks up the A record for "www.example.com"'
    - kw: Then
      text: 'it follows the CNAME and returns "203.0.113.5"'
    - kw: And
      text: 'if the first response already contained the A record, it is returned without another query'
code:
  lang: go
  source: |
    func (r *Resolver) lookupA(name string) (string, error) {
      for i := 0; i < maxCNAME; i++ {
        msg, _ := r.ask(nextID(), name)
        if a := findA(msg.Answers, name); a != "" { return a, nil }
        if cn := findCNAME(msg.Answers, name); cn != "" {
          name = cn; continue // chase the alias
        }
      }
    }
checkpoint: The resolver follows a CNAME chain to an address. Commit and stop here.
---

Many names are **aliases**. Ask for `www.example.com` and the answer might be a
**CNAME** record saying "the canonical name is `target.example.net`" - not the
address you wanted. To finish the job the resolver must take that target name and
**look it up in turn**, repeating until it gets an A record. A chain can be several
hops (`www` to a load balancer to a CDN host), so loop rather than handle a single
alias.

Guard the loop with a small cap so a mischievous chain of CNAMEs pointing in a
circle cannot spin forever - the same defensive instinct as the pointer-loop guard.
When the answer already has the A record for the name (no alias in the way), return
it immediately without a second query. Chasing CNAMEs is the first bit of real
**resolution logic** - the resolver making follow-up queries based on what it
learns - and it is a warm-up for the bigger loop ahead: walking the delegation from
the root.
