# encoding: utf-8

# This class represents an inserted word.
class Word < ActiveRecord::Base

  # Relations
  belongs_to :user
  has_many :games, :autosave => true
  has_many :new_word_games, :autosave => true
  belongs_to :show_word

  CHARS = [
   [['z'		], ['t', '@'		], ['j'				], ['f'		]],
   [['c'		], ['h'			], ['i', 'y'			], [		]],
   [[			], ['d', 'm'		], ['k', 's', 'v', 'l', 'r'	], ['b', 'n'	]],
   [['e', 'w', 'x'	], ['a', 'à', '@'	], ['o', 'g', 'q'		], ['u'		]]
  ]

  # Scope for words without space in it.
  scope :without_space, where("words.word NOT LIKE '% %'")
  # Scope for words with only ASCII chars without numbers.
  scope :without_special_chars, where("words.word REGEXP '^[a-zA-Z]*$'")
  # Scope for minimal length of 3 chars.
  scope :minimal_length, where("LENGTH(words.word) > 2")
  # Scope for guessing
  scope :to_guess, without_space.without_special_chars.minimal_length

  # The latest words, by default 12 entries.
  def self.latest(amount = 12)
    order('created_at DESC').limit(amount)
  end

  # Gets a random word.
  def self.random
    offset = rand(self.count)

    self.first(:offset => offset)
  end

  # Returns a word for guessing of the set level.
  # * Level one means word without special chars and no space.
  # * Level two is the same like level one but everything in lowercase.
  def self.guess_random(level = 1)
    case level
      when 1
        uncached do
          self.to_guess.random
        end
      when 2
        uncached do
          self.random
        end
    end
  end
end
