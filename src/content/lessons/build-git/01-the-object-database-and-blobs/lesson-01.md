---
project: build-git
lesson: 1
title: 'The repository and its object database'
overview: 'Git is really a little database that stores every version of everything under the hash of its contents. That database lives in a directory, so before we can store a single object we need to create that directory. Today you initialise a repository.'
goal: 'Create a repository rooted at a directory, with an object database directory inside it.'
spec:
  scenario: A new repository has an object database directory
  status: failing
  lines:
    - kw: Given
      text: 'an empty directory at some path repoPath'
    - kw: When
      text: 'the repository is initialised with Init(repoPath)'
    - kw: Then
      text: 'a directory exists at repoPath/.mygit/objects'
    - kw: And
      text: 'initialising a second, separate path creates its own independent .mygit/objects'
code:
  lang: go
  source: |
    // the object database is just a directory of files
    func Init(root string) error {
      objects := filepath.Join(root, ".mygit", "objects")
      return os.MkdirAll(objects, 0o755)
    }
checkpoint: 'You can initialise a repository with its own object database directory. Commit and stop here.'
---

Real Git keeps everything under a hidden `.git` directory, and the heart of it is
`.git/objects` - a plain directory of files where every version of every file,
every directory listing, and every commit is stored. There are no fancy formats
at the top level: it is a filesystem folder full of content-addressed blobs. We
will use `.mygit` instead of `.git` so our tool never touches a real repository's
data by mistake.

Today is deliberately tiny: create the repository directory and the `objects`
directory inside it. That folder is where every object we build for the rest of
the project will be written. Keeping our data under our own `.mygit` directory,
never the real `.git`, is a safety rule we hold to the whole way through.
