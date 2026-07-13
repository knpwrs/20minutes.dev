---
project: build-an-lsm-storage-engine
lesson: 15
title: A footer marks the end of data
overview: To find keys without scanning, an SSTable needs a table of contents - but first the reader has to know where the data ends and that table begins. Today you append an index and a fixed-size footer, and teach the reader to stop at the data boundary.
goal: Append an index and a fixed-size footer to an SSTable, and bound the reader to the data section.
spec:
  scenario: Writing a footer that marks where the data ends
  status: failing
  lines:
    - kw: Given
      text: 'entries ("apple",...), ("banana",...), ("cherry",...) written to an SSTable, followed by an index of key offsets and a fixed-size footer'
    - kw: When
      text: the file is opened and the footer at the end is read
    - kw: Then
      text: the footer gives the byte offset where the data section ends and the index begins
    - kw: And
      text: 'iterating and Get still return the three records correctly - the reader stops at the data boundary and never decodes the index or footer bytes as records'
code:
  lang: go
  source: |
    // file layout:
    //   [data: records...][index: (key, recordOffset) pairs][footer]
    // footer is a FIXED size at EOF holding the index's start offset
    // (which is also where the data section ends). record each
    // record's offset as you write the data, so the index can be built.
    // OpenSSTable: read footer at (fileSize - footerSize) -> dataEnd,
    // and bound Iterator/Get to [0, dataEnd) so the trailer is ignored.
checkpoint: An SSTable carries an index and a footer, and the reader stops cleanly at the data boundary. Commit and stop here.
---

To look a key up without scanning, the file needs a table of contents, and the
groundwork for it is knowing where the records stop. Today you append two things
after the data: an **index** (built from the byte offset of each record, which you
record as you write them) and a small, **fixed-size footer** holding the offset
where the index begins - which is exactly where the **data section ends**.

The footer is the bootstrap. A reader opening the file cold seeks to
`fileSize - footerSize`, reads the footer, and learns the data boundary without
scanning anything. The critical continuity point: your existing iterator and `Get`
walked records to the end of the file - now they must stop at that boundary, or
they would try to decode index and footer bytes as if they were records. Bound them
to `[0, dataEnd)` and the trailer stays invisible to normal reads. The index is now
on disk, ready for the next lesson to actually *use*.
