class NewWordGame < Game

  # Overall score
  #
  # PI is the only allowed constant in these calculations!!!
  def calculate_score
    self.word = Word.find_or_initialize_by_word(self.input)
    self.won = self.word.new_record?
  end

end
