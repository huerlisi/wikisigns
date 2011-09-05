class User < ActiveRecord::Base
  
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  
  has_many :games
  has_many :words
  has_many :user_tokens

  # String
  def to_s
    email
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
    begin
      Koala::Facebook::GraphAPI.new(user_tokens.where('provider = ?', 'facebook'))
    rescue Koala::Facebook::APIError
      logger.info('--------------------------------------------------------')
      logger.info('Facebook Session Expired. graph function')
      logger.info('--------------------------------------------------------')
    end
  end

  def publish_on_fb(img_path, word)
    begin
      self.graph.put_picture(img_path, 'image/png', {:message => "#{word} on http://wikisigns.ch/word/#{word}"})
    rescue Koala::Facebook::APIError
      logger.info('--------------------------------------------------------')
      logger.info('Facebook Session Expired. publish on fb.')
      logger.info('--------------------------------------------------------')
    end
  end
  
  # ----------------------------------
  # Following code is from: https://github.com/holden/devise-omniauth-example/blob/master/app/models/user.rb
  # ----------------------------------
  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session[:omniauth]
        user.user_tokens.build(:provider => data['provider'], :uid => data['uid'])
      end
    end
  end
  
  def apply_omniauth(omniauth)
    #add some info about the user
    #self.name = omniauth['user_info']['name'] if name.blank?
    #self.nickname = omniauth['user_info']['nickname'] if nickname.blank?
    
    unless omniauth['credentials'].blank?
      user_tokens.build(:provider => omniauth['provider'], :uid => omniauth['uid'])
      #user_tokens.build(:provider => omniauth['provider'], 
      #                  :uid => omniauth['uid'],
      #                  :token => omniauth['credentials']['token'], 
      #                  :secret => omniauth['credentials']['secret'])
    else
      user_tokens.build(:provider => omniauth['provider'], :uid => omniauth['uid'])
    end
    #self.confirm!# unless user.email.blank?
  end
end
