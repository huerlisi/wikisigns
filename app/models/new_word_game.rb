class NewWordGame < Game

  # Overall score
  #
  # PI is the only allowed constant in these calculations!!!
  def calculate_score
    unless Word.where(:word => self.input).exists?
      self.word = Word.create(:word => self.input, :user => self.user)
      self.won = true
    end
  end

  private

  def check_inserted_word
    unless Word.where(:word => self.input).exists?
      self.word = Word.create(:word => self.input, :user => self.user)
      self.won = true
    end
  end
end
