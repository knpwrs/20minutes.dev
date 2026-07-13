---
project: build-git
lesson: 9
title: 'The tree object'
overview: 'A directory listing is the concatenation of its entries, sorted by name, wrapped as a tree object and hashed. Today your tree ids start matching real Git, the first Merkle-tree payoff of the project.'
goal: 'Build a tree object from a set of entries and hash it to an id that matches real Git.'
spec:
  scenario: Sorted entries form a tree object
  status: failing
  lines:
    - kw: Given
      text: 'two file entries, hello.txt at ce013625030ba8dba906f756967f9e9ca394464a and README.md at 0805455a24b6c68fbc38d0fa5d121f735984285d, both mode 100644'
    - kw: When
      text: 'WriteTree builds the tree body by sorting the entries by name and concatenating their encodings, then hashes it as a tree object'
    - kw: Then
      text: 'the entries appear in the order README.md then hello.txt (byte order, uppercase R before lowercase h)'
    - kw: And
      text: 'the tree id is 3aa9b583db8437a8dabb60b4b4c86ae87c17de85'
code:
  lang: go
  source: |
    // sort entries by name, concat EncodeEntry(...) for each, hash as "tree"
    func (r *Repo) WriteTree(entries []Entry) (string, error) {
      sort.Slice(entries, func(i, j int) bool { return entries[i].Name < entries[j].Name })
      var body []byte
      // for each sorted entry: body = append(body, EncodeEntry(e)...)
      return r.WriteObject("tree", body)
    }
checkpoint: 'Your tree ids match real Git. Commit and stop here. Confirm with git mktree.'
---

A tree body is nothing more than its entries laid end to end, but there is one
non-negotiable rule: **entries are sorted by name** before hashing. Git compares
names as raw bytes, so uppercase letters (like `R`, byte 0x52) sort before
lowercase (like `h`, byte 0x68), and `README.md` comes before `hello.txt`. Sort
differently and you get a different byte sequence and therefore a different hash,
even though the entries are the same.

Wrap the sorted, concatenated entries as a `tree` object (the same `WriteObject`
that stored blobs) and you have a directory listing whose id is a fingerprint of
its exact contents. This is the **Merkle** structure at the core of Git: a tree's
id depends on the ids of everything it contains, which depend on their contents,
all the way down. Change one byte in one file and every tree from it to the root
gets a new id. You can feed the same entries to `git mktree` and get the identical
`3aa9b583...` back.
