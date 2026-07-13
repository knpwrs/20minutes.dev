---
project: build-a-cron-parser
lesson: 1
title: Splitting a cron line into five fields
overview: A cron expression is five fields separated by whitespace - minute, hour, day-of-month, month, day-of-week. Before parsing anything you have to split the line into exactly those five parts, and reject a line that has the wrong number.
goal: Split an expression on whitespace into five fields, or return an error if there are not exactly five.
spec:
  scenario: A cron line splits into exactly five fields
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''*/15 0 1,15 * 1-5'''
    - kw: When
      text: 'SplitFields is called on it'
    - kw: Then
      text: 'it returns the five fields ''*/15'', ''0'', ''1,15'', ''*'', ''1-5'' in order'
    - kw: And
      text: 'SplitFields(''1 2 3'') returns an error, and SplitFields(''1 2 3 4 5 6'') returns an error'
code:
  lang: go
  source: |
    func SplitFields(expr string) ([]string, error) {
      f := strings.Fields(expr) // splits on any run of whitespace
      if len(f) != 5 {
        return nil, fmt.Errorf("expected 5 fields, got %d", len(f))
      }
      return f, nil
    }
checkpoint: You can split a cron line into its five fields and reject the wrong count. Commit and stop here.
---

A standard cron expression is a single line of five fields separated by spaces or
tabs: **minute**, **hour**, **day-of-month**, **month**, and **day-of-week**, always
in that order. Everything else in this project is about interpreting one field at a
time, so the very first job is to chop the line into exactly five pieces. Splitting
on any run of whitespace (not a single space) means extra spacing between fields
does not matter, which is how real crontabs are written.

The one rule to enforce today is the count: a line with four or six fields is not a
valid five-field cron expression, so reject it with a clear error rather than
guessing what the writer meant. Pin both the good split and the wrong-count failure
now - every later lesson receives exactly five field strings and never has to worry
about the shape of the line again.
