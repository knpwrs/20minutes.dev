---
title: 'Build a URL Parser'
order: 49
lessons: 25
size: 'Small'
tech: ['RFC 3986', 'URI parsing', 'Percent-encoding']
estMin: 20
desc: 'Build a real URL/URI parser from first principles, straight out of RFC 3986: split any URI into its five components (scheme, authority, path, query, fragment) with the generic-syntax algorithm, break the authority into userinfo, host - reg-name, IPv4, or bracketed IPv6 - and port, percent-decode and percent-encode components against the unreserved and reserved sets, run the remove_dot_segments algorithm and syntax-based normalization, parse a query string into key/value pairs, and implement the Section 5 reference-resolution algorithm that turns a relative reference against a base into an absolute URI - ending in a library that reproduces the exact RFC 3986 Appendix C examples.'
blurb: 'Every value is checkable because the whole project is anchored to RFC 3986, right down to the Appendix C reference-resolution table against base http://a/b/c/d;p?q. Each lesson is one concrete spec with exact components, decoded bytes, and resolved URLs: a full URL split five ways and one missing its authority, a scheme-relative //host/path, a bracketed IPv6 host with a port, %20 decoding to a space and a lowercase %2f, remove_dot_segments turning /a/b/../c into /a/c, a default port dropped in normalization, + becoming a space in a query value, and the exact resolved results like g against the base giving http://a/b/c/g and ../../../g giving http://a/g.'
overview: |
  Over 25 lessons you build a working URL/URI parser straight from RFC 3986, the standard that every browser, HTTP client, and web framework relies on. You start with the generic syntax - the algorithm that splits any URI into scheme, authority, path, query, and fragment - then break the authority down into userinfo, host, and port (handling reg-names, IPv4 addresses, and IPv6 literals in brackets), implement percent-encoding and decoding against the unreserved and reserved character sets, run the remove_dot_segments algorithm and syntax-based normalization, parse a query string into key/value pairs, and finish with the centerpiece: the Section 5 reference-resolution algorithm that resolves a relative reference against a base URI into an absolute one.

  You build it as an importable library whose public API - parse a string into a URI, percent-encode and decode, normalize, parse a query, and resolve a reference against a base - is exactly what you would reach for when working with URLs in a real program. Because everything is pinned to RFC 3986, the values are all hand-checkable: the capstone reproduces the exact Appendix C examples, resolving references like g, ../g, and ../../../g against the base http://a/b/c/d;p?q to their precise absolute results.

  This is a teaching-grade RFC 3986 parser: it parses, normalizes, and resolves URIs exactly as the RFC specifies, and it is honest about its limits - it implements RFC 3986 generic syntax rather than the WHATWG URL Standard that browsers use for web addresses (with its own normalization, IDNA host processing, and error recovery), it validates structure rather than every scheme-specific rule, and it treats components as UTF-8 text. What you finish with is the honest core that URL libraries share, before the scheme-specific and browser-compatibility layers they add on top.
parts:
  - name: 'The five components'
    count: 5
  - name: 'Scheme and authority'
    count: 5
  - name: 'Percent-encoding'
    count: 3
  - name: 'Path and normalization'
    count: 5
  - name: 'Query and fragment'
    count: 2
  - name: 'Reference resolution and a capstone'
    count: 5
caveats:
  note: 'A complete, correct RFC 3986 generic-syntax URI library - parse into components, recompose, percent-encode and decode, remove dot segments, normalize (case, percent-escapes, default port), parse a query into decoded pairs, and resolve a reference against a base reproducing the RFC Section 5.4 example table exactly - plus a small runnable demo that reuses it. It deliberately stops short of WHATWG URL parsing, IDNA/punycode hosts, and strict numeric IPv4/IPv6 address validation.'
  future:
    - 'Add strict IPv4 and IPv6 address validation instead of falling back to a registered name for an out-of-range octet or accepting any bracketed host.'
    - 'Offer a validating parse that surfaces a malformed percent-escape or a non-numeric port up front, rather than only when a component is later decoded or checked.'
    - 'Round out the per-component encoders (userinfo and host) alongside the path-segment, query, and fragment encoders already built.'
    - 'Add the inverse of ParseQuery - build a query string back from key/value pairs - so query parameters round-trip.'
    - 'Add the non-strict resolution mode from RFC 3986 Section 5.2.2 that tolerates a legacy same-scheme reference.'
    - 'Grow toward the WHATWG URL Standard: IDNA/punycode host processing and the error-tolerant parsing browsers use, as a clearly separate, larger project.'
resources:
  - title: 'RFC 3986: Uniform Resource Identifier (URI): Generic Syntax'
    author: 'T. Berners-Lee, R. Fielding, L. Masinter'
    url: 'https://www.rfc-editor.org/rfc/rfc3986'
    note: 'The specification this entire project implements. Appendix B gives the parse regex, Section 3 the component grammar, Section 5 the reference-resolution algorithm, and Section 5.4 (mirrored in Appendix C) the exact normal and abnormal resolution examples against base http://a/b/c/d;p?q that the capstone reproduces. Keep it open beside every lesson.'
  - title: 'RFC 3986 Section 5.4: Reference Resolution Examples'
    author: 'T. Berners-Lee, R. Fielding, L. Masinter'
    url: 'https://www.rfc-editor.org/rfc/rfc3986#section-5.4'
    note: 'The pinned example table - normal cases like g giving http://a/b/c/g and abnormal ones like ../../../g giving http://a/g - that makes reference resolution exactly testable. Every resolution lesson asserts values straight from here.'
  - title: 'URL Standard (WHATWG)'
    url: 'https://url.spec.whatwg.org/'
    note: 'The living standard browsers actually use for web URLs. Read it to see where RFC 3986 and the web diverge: WHATWG defines its own error-tolerant parser, host processing (IDNA, IPv4 shorthand), percent-encode sets per component, and a different normalization model. A useful contrast to the strict RFC parser you build here.'
  - title: 'URL - MDN Web Docs'
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/URL'
    note: 'The browser URL API and its component properties (protocol, host, pathname, search, hash). Handy for comparing your parsed components against what a mainstream implementation exposes, and for the search-params model behind the query chapter.'
  - title: 'RFC 3987: Internationalized Resource Identifiers (IRIs)'
    author: 'M. Duerst, M. Suignard'
    url: 'https://www.rfc-editor.org/rfc/rfc3987'
    note: 'The extension of RFC 3986 to non-ASCII characters via UTF-8 percent-encoding. Read it to see where the ASCII-only URI you build maps to and from internationalized identifiers - the direction a real-world parser grows.'
---
