class NewWordGame < Game

  def check_game
    check_inserted_word
    calculate_score
  end
end