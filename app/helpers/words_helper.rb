module WordsHelper

  def latest_words
    Word.all.reverse
  end
end
