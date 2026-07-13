---
project: build-git
lesson: 8
title: 'A tree entry'
overview: 'A tree object records the contents of one directory as a list of entries, each naming a file or subdirectory. Today you encode a single entry, the building block of every directory listing, with its mode, name, and the raw bytes of a hash.'
goal: 'Encode one tree entry as a mode, a name, a NUL, and the 20 raw bytes of an id.'
spec:
  scenario: One entry is mode, name, NUL, and a binary id
  status: failing
  lines:
    - kw: Given
      text: 'a file entry with mode 100644, name hello.txt, and id ce013625030ba8dba906f756967f9e9ca394464a'
    - kw: When
      text: 'the entry is encoded with EncodeEntry(mode, name, id)'
    - kw: Then
      text: 'it is the ASCII 100644 space hello.txt, then a NUL byte, then the 20 raw bytes of the id (the hex decoded to binary), 37 bytes in total'
    - kw: And
      text: 'the three modes we use are 100644 for a file, 100755 for an executable file, and 40000 for a subdirectory'
code:
  lang: go
  source: |
    // "<mode> <name>\0" then the id as 20 raw bytes, NOT 40 hex chars
    func EncodeEntry(mode, name, id string) []byte {
      raw, _ := hex.DecodeString(id) // 40 hex -> 20 bytes
      out := []byte(mode + " " + name + "\x00")
      return append(out, raw...)
    }
checkpoint: 'You can encode a single tree entry. Commit and stop here.'
---

A **tree** is Git's directory: a flat list of entries, one per item directly
inside that directory. Each entry has three parts: a **mode** (a numeric file
type, like Unix permission bits), the **name** of the file or subdirectory, and
the **id** of the object it points at. A file entry points at a blob; a
subdirectory entry points at another tree.

The encoding has one sharp edge worth pinning now: the id is stored as **20 raw
bytes**, the binary form of the hash, not the 40 hex characters we print. So the
hello.txt entry is the text `100644 hello.txt`, a NUL separator, then the 20-byte
form of `ce013625...`. The modes are written as plain digits with no leading zero
(so a directory is `40000`, not `040000`). Get these bytes exactly right and the
tree ids will match real Git; get the binary-vs-hex detail wrong and every tree
hash will be off.
