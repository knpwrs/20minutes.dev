---
project: build-a-dns-resolver
lesson: 20
title: MX records
overview: An MX record names a mail server plus a preference number that orders competing servers. Today you parse its two-part RDATA - a 16-bit preference followed by a domain name.
goal: Parse an MX record's preference and exchange name from its RDATA.
spec:
  scenario: An MX record is a preference then a name
  status: failing
  lines:
    - kw: Given
      text: 'an MX record whose RDATA is 00 0A 04 6d 61 69 6c 07 65 78 61 6d 70 6c 65 03 63 6f 6d 00'
    - kw: When
      text: 'the RDATA is parsed'
    - kw: Then
      text: 'the preference is 10 and the exchange is "mail.example.com"'
    - kw: And
      text: 'the preference occupies the first two bytes and the name fills the rest'
code:
  lang: go
  source: |
    type MX struct {
      Preference uint16
      Exchange   string
    }
    // first two bytes are the preference, then a name (which may compress)
    pref := uint16At(rdata, 0)
    name, _ := decodeName(msg, rdataOff+2)
checkpoint: You can parse an MX record. Commit and stop here.
---

An **MX record** points mail for a domain at a mail server, and it has two parts: a
16-bit **preference** and an **exchange** name (the server). The preference orders
alternatives - lower numbers are tried first - so a domain can list several mail
servers with different preferences. On the wire the preference is the first two
bytes of RDATA, and the exchange name follows immediately, encoded just like any
other name and eligible for compression.

So parsing MX is: read a 16-bit value, then decode a name starting two bytes into
the RDATA (against the full message, so pointers resolve). The RDATA here gives
preference `10` and exchange `mail.example.com`. This preference-then-name shape is
a common pattern - a couple of fixed fields followed by a name - and it is good
practice for the multi-field record coming next.
