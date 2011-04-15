# encoding: utf-8

# This class represents an inserted word.
class Word < ActiveRecord::Base
  CHARS = [
   [['z'], ['t', '@'], ['j'], ['f']],
   [['c'], ['h'], ['i', 'y'], []],
   [[], ['d', 'm'], ['k', 's', 'v', 'l', 'r'], ['b', 'n']],
   [['e', 'w', 'x'], ['a', 'à', '@'], ['o', 'g', 'q'], ['u']]
  ]

  # Scope for words without space in it.
  scope :without_space, lambda { where("words.word NOT LIKE '% %'") }
  # Scope for words with only ASCII chars without numbers
  scope :without_special_chars, lambda { where("words.word REGEXP '^[a-zA-Z ]*$'") }

  # The latest words, by default 12 entries.
  def self.latest(amount = 12)
    self.all(:order => 'created_at DESC', :limit => amount)
  end

  # Gets a random word.
  def self.random
    uncached do
      offset = rand(self.count)

      self.first(:offset => offset)
    end
  end

  # Returns a word for guessing of the set level.
  # * Level one means word without special chars and no space.
  # * Level two is the same like level one but everything in lowercase.
  def self.guess_random(level = 1)
    case level
      when 1
        uncached do
          self.where("words.word NOT LIKE '% %'").where("words.word REGEXP '^[a-zA-Z ]*$'").first(:offset => rand(self.count))
        end
      when 2
        uncached do
          self.where("words.word NOT LIKE '% %'").first(:offset => rand(self.count))
        end
    end
  end
end
