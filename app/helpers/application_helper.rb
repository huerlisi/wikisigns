module ApplicationHelper
  def latest_words
    Word.latest
  end
end
