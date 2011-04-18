class Game < ActiveRecord::Base
  belongs_to :user
  belongs_to :word

  after_create :calculate_score

  def calculate_score
    if Word.find_by_word(self.input)
      self.score = 5 * rand(500)
    else
      self.score = 0
    end
  end
end
