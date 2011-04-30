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
    calculate_score
  end

  # Calculates the game score.
  def profile_factor
    return 1 unless user
    
    # Use logarithm to PI of the users word count (+2)
    Math.log(user.words.count + 2)/Math.log(Math::PI**Math::PI)
  end
  
  def hint_factor
    return 1 if helped_letters == 0

    guessed = word.word.length - helped_letters
    return (guessed.to_f / word.word.length)**(Math::PI*2)
  end
  
  def length_factor
    (word.word.length - helped_letters)**Math::PI
  end

  def calculate_score
    if Word.where(:word => input).exists?
      word_factor = 1
    else
      word_factor = 0
    end
    
    random_factor = rand(7) + 7
    
    score = word_factor * length_factor * hint_factor * random_factor * profile_factor
    
    self.score = score.round
  end

  private

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
end
