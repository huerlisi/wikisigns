class Game < ActiveRecord::Base
  # Associations
  belongs_to :user
  belongs_to :word

  # Calculate the score after creating.
  before_save :calculate_score

  # Scope for returning the games of the day.
  scope :today, where(:created_at => Time.now.at_beginning_of_day..Time.now.tomorrow.at_beginning_of_day)

  # Overall score
  #
  # PI is the only allowed constant in these calculations!!!
  def calculate_score
    self.score = word_factor * length_factor * hint_factor * random_factor * profile_factor
    self.won = self.score > 0
  end

  private

  # Calculates the game score.
  def profile_factor
    return 1 unless user

    # Use logarithm to PI of the users word count
    # Adding PI right away to circumvent problems with log
    Math.log(user.words.count + Math::PI)/Math.log(Math::PI**Math::PI)
  end

  # Hint factor
  #
  # We agressively reduce points for hints
  def hint_factor
    # Full points of no help needed
    return 1 if helped_letters == 0

    guessed = word.word.length - helped_letters
    return (guessed.to_f / word.word.length)**(Math::PI+Math::PI)
  end

  # Length factor
  #
  # Correctly guessed characters to the power of PI
  def length_factor
    (word.word.length - helped_letters)**Math::PI
  end

  # Word factor
  #
  # All or nothing: word in database?
  def word_factor
    if Word.where(:word => input).exists?
      1
    else
      0
    end
  end

  # Random factor
  #
  # Somewhere betwee two and three PIs
  def random_factor
    rand(Math::PI) + Math::PI*Math::PI
  end
end
