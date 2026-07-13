---
title: 'Build an Arbitrary-Precision Integer Library'
order: 36
lessons: 32
size: 'Small'
tech: ['Arbitrary precision', 'Karatsuba', 'Long division']
estMin: 20
desc: 'Build a real big-integer library from first principles, storing every number as a little-endian array of base-1000000000 limbs plus a sign - never leaning on a language built-in like Go math/big. Start with the limb array, normalization, and exact decimal parse and render, then magnitude comparison, schoolbook addition and subtraction with carry and borrow, signed dispatch, schoolbook and Karatsuba multiplication, single-limb and full long division producing quotient and remainder, and finish with bit shifts, fast exponentiation, modular exponentiation, GCD, and hexadecimal - ending in a library that computes 100 factorial and 2 to the 1000th power to the exact decimal digit.'
blurb: 'Model a big number as a slice of 9-decimal-digit limbs so every operation is a carry, borrow, or shift you can assert against exactly - no bignum built-in, only fixed-width machine integers. Each lesson is one concrete spec with real values: a carry that grows the limb count, a subtraction that shrinks it or flips the sign, multiply by zero collapsing to canonical zero, Karatsuba agreeing with schoolbook on a multi-limb pair, a long-division remainder strictly smaller than the divisor, and a parse-and-render round-trip of a 20-digit number.'
overview: |
  Over 32 lessons you build a working arbitrary-precision integer library from scratch - a BigInt type with arithmetic, parsing, and formatting - representing every number as a little-endian slice of fixed-base limbs plus a sign. You implement every operation yourself on that limb array; you never delegate to the host language's built-in big-integer type, and you use only fixed-width machine integers as limbs. That keeps the whole library exactly testable: every result is a precise decimal string you can assert against.

  You choose base 1000000000 so that a group of exactly nine decimal digits is one limb, which makes parsing and rendering decimal trivial and exact from the very first chapter. From there you build magnitude comparison, schoolbook addition with carry and subtraction with borrow, signed add and subtract that dispatch on sign and magnitude, schoolbook long multiplication and then Karatsuba divide-and-conquer for large operands, single-limb short division and full schoolbook long division producing an exact quotient and remainder, and a final chapter of higher operations: bit shifts, square-and-multiply exponentiation, modular exponentiation, Euclid's GCD, and hexadecimal conversion. The capstone computes genuinely large exact results - 100 factorial and 2 to the 1000th power as full decimal strings, plus a modular-exponentiation result checked against a known value.

  This is a teaching-grade bignum library built around the classical algorithms from Knuth's Seminumerical Algorithms: it is correct and exact but not tuned for speed the way GMP is - it uses base 1000000000 rather than a full machine-word base, Karatsuba but not the asymptotically faster Toom-Cook or FFT multiplication, and schoolbook long division rather than the fastest known divide-and-conquer division. It is the honest core that a production library like GMP extends with word-sized limbs, more multiplication algorithms, and heavy platform-specific tuning.
parts:
  - name: 'Limbs, sign, and decimal I/O'
    count: 7
  - name: 'Comparison, addition, and subtraction'
    count: 6
  - name: 'Multiplication'
    count: 6
  - name: 'Division and modulo'
    count: 5
  - name: 'Higher operations and the capstone'
    count: 8
caveats:
  note: 'A genuinely working arbitrary-precision integer library - exact signed arithmetic (add, subtract, schoolbook and Karatsuba multiply, long division with quotient and remainder), decimal and hexadecimal parse and render, fast and modular exponentiation, GCD, and bit shifts, all on a base-1000000000 limb array with no language bignum built-in - but it stays deliberately simple under the hood: base 1000000000 rather than word-sized limbs, one-level Karatsuba (no Toom-Cook or FFT), schoolbook long division with binary-searched quotient digits rather than Knuth Algorithm D with normalization, int-sized exponents and shift counts, and no modular inverse or rational numbers.'
  future:
    - 'Switch to machine-word limbs (base 2^32 or 2^64) for real performance, decoupling the internal base from decimal I/O'
    - 'Replace binary-searched quotient digits with Knuth Algorithm D (divisor normalization plus estimate-and-correct) for faster long division'
    - 'Extend Karatsuba to recurse at multiple levels and add Toom-Cook-3 before the crossover where FFT multiplication wins'
    - 'Add the extended Euclidean algorithm and a modular inverse, unlocking negative modular exponents and CRT-based tricks'
    - 'Take exponents and shift counts as BigInt rather than int, and add square root and general base conversion'
    - 'Add in-place and allocation-reducing variants of the hot operations to cut the garbage a from-scratch limb array generates'
resources:
  - title: 'The Art of Computer Programming, Volume 2: Seminumerical Algorithms'
    author: 'Donald E. Knuth'
    url: 'https://www-cs-faculty.stanford.edu/~knuth/taocp.html'
    note: 'Section 4.3 (Multiple-Precision Arithmetic) is the rigorous source for everything here - the classical add, subtract, and multiply, and Algorithm D, the schoolbook long-division method this project follows (here finding each quotient digit by binary search in place of Algorithm D normalization and estimate-and-correct).'
  - title: 'Multiplication of Multidigit Numbers on Automata'
    author: 'A. Karatsuba, Yu. Ofman'
    url: 'https://en.wikipedia.org/wiki/Karatsuba_algorithm'
    note: 'The original 1962 divide-and-conquer idea: split each operand in half and multiply with three products instead of four, dropping the cost below n squared. The linked article walks the split, the three recursive products, and the recombination this project implements.'
  - title: 'GNU MP (GMP) Manual: Algorithms'
    author: 'The GMP Development Team'
    url: 'https://gmplib.org/manual/Algorithms'
    note: 'How a production big-integer library actually does it: limb representation, the thresholds between schoolbook, Karatsuba, Toom-Cook, and FFT multiplication, and divide-and-conquer division. Read it to see what the teaching-grade version here deliberately leaves on the table.'
  - title: 'Modern Computer Arithmetic'
    author: 'Richard P. Brent, Paul Zimmermann'
    url: 'https://members.loria.fr/PZimmermann/mca/mca-cup-0.5.9.pdf'
    note: 'A free, modern, self-contained reference for arbitrary-precision arithmetic - representation, addition, the multiplication hierarchy, division, and exponentiation - filling the gap between Knuth and a real library. Chapter 1 maps almost one-to-one onto this project.'
  - title: 'Arbitrary-Precision Arithmetic (Big Integer)'
    author: 'CP-Algorithms'
    url: 'https://cp-algorithms.com/algebra/big-integer.html'
    note: 'A compact from-scratch big-integer writeup that uses exactly the base 1000000000 little-endian-limb representation this project adopts, with the same decimal grouping for I/O - the practical companion to the classical texts.'
---
