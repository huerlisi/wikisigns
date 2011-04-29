class User < Omnisocial::User
  has_many :games

  def post_score_to_fb_wall
    graph = Koala::Facebook::GraphAPI.new(self.access_token)
    id = graph.put_wall_post(I18n.t('game.message.score.text', :score => self.daily_score),
                                                          { "name" => "WikiSigns.ch - The Game",
                                                            "link" => new_game_url,
                                                            "caption" => "{*actor*} spielte auf WikiSigns.ch das Wortratespiel.",
                                                            "description" => "Probier es einfach auch mal aus.",
                                                            "picture" => svg_word_url(self.games.last.word, :format => :jpg)})
    self.last_facebook_post = Date.today
    self.save

    id
  end

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
end
