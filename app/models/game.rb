class Game < ActiveRecord::Base

  # Associations
  belongs_to :user
  belongs_to :word

  # Calculate the score after creating.
  after_create :check_game

  # Scope for returning the games of the day.
  scope :today, where(:created_at => Time.now.at_beginning_of_day..Time.now.tomorrow.at_beginning_of_day)

  def check_game
    check_guessed_word
    check_help
    calculate_score
  end

  private

  # Checks if the hole word was guessed with help
  def check_help
    if helped_letters == word.word.length
      self.won = false
    end
  end

  # Calculates the game score.
  def calculate_score
    self.score = 0
    self.score = guessed_letters * rand(500) if won?

    self.save
  end

  # Checks if the word exists.
  def check_guessed_word
    search_word = Word.find_by_word(self.input)
    if search_word
      self.word = search_word
      self.won = true
    else
      self.word = Word.create(:word => self.input, :user => self.user)
    end
  end

  # Returns how much the user guessed without the helped letters.
  def guessed_letters
    helped_letters ? word.word.length - helped_letters : word.word.length
  end
end
