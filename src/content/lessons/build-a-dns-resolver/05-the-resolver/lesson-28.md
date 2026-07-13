---
project: build-a-dns-resolver
lesson: 28
title: Referrals and glue
overview: When a server is not authoritative it does not answer - it refers you to servers closer to the name, listing them as NS records with their addresses as glue. Today you read a referral to find the next server to ask.
goal: Extract the next server address from a referral's NS and glue records.
spec:
  scenario: A referral points at the next server via NS and glue
  status: failing
  lines:
    - kw: Given
      text: 'a referral response with no answers, an authority NS record naming "a.gtld-servers.net", and an additional (glue) A record giving a.gtld-servers.net the address 192.5.6.30'
    - kw: When
      text: 'the resolver reads the referral for a next server to query'
    - kw: Then
      text: 'it returns the address "192.5.6.30" (the glue for the referred name server)'
    - kw: And
      text: 'the next server comes from matching an authority NS name to an additional-section A record'
code:
  lang: go
  source: |
    // TypeNS = 2. Decoding the NS name needs the whole message, so keep the
    // raw response bytes on the Message (a Raw field set in ParseMessage).
    func nextServer(m Message) (string, error) {
      for _, ns := range m.Authority {
        if ns.Type != TypeNS { continue }
        nsName, _ := decodeNameRData(m.Raw, ns.RDataOff) // the referred server
        // find that name's glue A record in the additional section
        if a := findGlue(m.Additional, nsName); a != "" { return a, nil }
      }
    }
checkpoint: The resolver reads a referral to find the next server. Commit and stop here.
---

DNS is a delegated tree, and most servers you ask are **not authoritative** for
the name. Instead of answering, they send a **referral**: an empty answer section,
a set of **NS records** in the authority section naming servers that are closer to
the name, and - crucially - **glue** in the additional section, which is the A
records giving those name servers' IP addresses. Without glue you would have a
chicken-and-egg problem (you would need to resolve the name server's name to
resolve the name), so the parent zone bundles the addresses right in.

Reading a referral is therefore: find an NS record (type `2`) in the **authority**
section, decode the server name from its RDATA, and look up that name's address in
the **additional** section's glue. Decoding the NS name means resolving its RDATA
against the whole message (its pointers are message-relative), so the parsed
`Message` needs to keep the raw response bytes around - add a `Raw` field that
`ParseMessage` fills, and decode the NS target from `m.Raw` at the record's RDATA
offset. Here the `.com` name server `a.gtld-servers.net` comes with glue
`192.5.6.30`, so that is the address to query next. This single step - turning a
referral into a next hop - is the engine of iterative resolution, which the next
lesson wraps in a loop from the root all the way down.
