class NewWordGame < Game
  def check_game
    check_inserted_word
    calculate_score
  end

  private

  def check_inserted_word
    unless Word.find_by_word(self.input)
      self.word = Word.create(:word => self.input, :user => self.user)
      self.won = true
    end
  end
end
