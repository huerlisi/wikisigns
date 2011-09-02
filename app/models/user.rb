class User < ActiveRecord::Base
  
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  
  has_many :games
  has_many :words

  # String
  def to_s
    login_account.name
  end

  def self.find_for_facebook_oauth(token, signed_in_resource=nil)
    data = token['extra']['user_hash']
    email = signed_in_resource.email if signed_in_resource
    email ||= data["email"]

    if user = User.find_by_email(email)
      user.access_token = token['credentials']['token']
      user.login_type = 'facebook'
      user.save

      user
    else # Create a user with a stub password.
      User.create(:email => data["email"], 
                  :password => Devise.friendly_token[0,20], 
                  :login_type => 'facebook',
                  :access_token => token['credentials']['token'])
    end
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
      Koala::Facebook::GraphAPI.new(access_token)
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
  
  def from_facebook?
    login_type.eql?'facebook'
  end
  alias has_facebook? from_facebook?
end
