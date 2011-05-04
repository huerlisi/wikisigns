class NewWordGame < Game

  # Overall score
  #
  # PI is the only allowed constant in these calculations!!!
  def calculate_score
    self.score = word_factor * random_factor * profile_factor * new_word_factor
    self.word = Word.find_or_initialize_by_word(self.input)
    if self.word.new_record?
      self.won = true
      self.word.user = self.user
      self.word.save
    end
  end

  private

  def new_word_factor
    Math::PI*Math::PI
  end
end
