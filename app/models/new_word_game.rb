class NewWordGame < Game

  # Overall score
  #
  # PI is the only allowed constant in these calculations!!!
  def calculate_score
    if Word.where(:word => self.input).empty?
      self.score = random_factor * profile_factor * new_word_factor
      self.won = true
    else
      self.won = false
    end

    self.word = Word.create(:word => self.input, :user => self.user)
    self.word.save
  end

  private

  def new_word_factor
    Math::PI*Math::PI*(Math::PI + rand(Math::PI))
  end
end
