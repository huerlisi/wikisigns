class User < Omnisocial::User

  has_many :games
  has_many :words
  belongs_to :gamer

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
