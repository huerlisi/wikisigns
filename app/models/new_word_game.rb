class NewWordGame < Game

  # Overall score
  #
  # PI is the only allowed constant in these calculations!!!
  def calculate_score
    self.word = Word.find_or_initialize_by_word(self.input)
    self.won = self.word.new_record?
    self.score = word_factor * length_factor * random_factor * profile_factor
  end

end
