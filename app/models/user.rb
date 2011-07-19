class User < Omnisocial::User
  has_many :games
  has_many :words

  # String
  def to_s
    login_account.name
  end

  # Messages
  # ========
  has_many :incomming_messages, :class_name => 'Message', :foreign_key => 'to_user_id'
  has_many :outgoing_messages, :class_name => 'Message', :foreign_key => 'from_user_id'

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
