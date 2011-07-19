class User < Omnisocial::User
  has_many :games
  has_many :words

  # String
  def to_s
    login_account.name
  end

  # Scores
  # ======
  def daily_score
    games.today.sum(:score)
  end

  def total_score
    games.sum(:score)
  end

  # Facebook
  # ========
  def graph
    Koala::Facebook::GraphAPI.new(self.access_token)
  end

  def publish_on_fb(img_path, word)
    self.graph.put_picture(img_path, 'image/png', {:message => "#{word} on http://wikisigns.ch/word/#{word}"})
  end
end
