module WordsHelper
  def latest_words
    Word.latest.reverse
  end
end
