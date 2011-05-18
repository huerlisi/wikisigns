class User < Omnisocial::User
  has_many :games
  has_many :words

  def daily_score
    score = 0
    games.today.each { |g| score = score + g.score }

    score
  end

  def total_score
    score = 0
    games.all.each { |g| score = score + g.score }

    score
  end

  def graph
    Koala::Facebook::GraphAPI.new(self.access_token)
  end

  def publish_on_fb(img_path, word)
    self.graph.put_picture(img_path, 'image/png', {:message => "#{word} on http://wikisigns.ch/word/#{word}"})
  end
end
