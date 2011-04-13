# encoding: utf-8

# This class represents an inserted word.
class Word < ActiveRecord::Base
  CHARS = [
   [['z'], ['t', '@'], ['j'], ['f']],
   [['c'], ['h'], ['i', 'y'], []],
   [[], ['d', 'm'], ['k', 's', 'v', 'l', 'r'], ['b', 'n']],
   [['e', 'w', 'x'], ['a', 'à', '@'], ['o', 'g', 'q'], ['u']]
  ]

  # The latest words, by default 12 entries.
  def self.latest(amount = 12)
    self.all(:order => 'created_at DESC', :limit => amount)
  end

  # Gets a random word.
  def self.random
    offset = rand(self.count)

    self.first(:offset => offset)
  end
end
