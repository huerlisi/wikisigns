Omnisocial.setup do |config|
  
  # ==> Twitter
  config.twitter Settings.twitter.consumer_key, Settings.twitter.consumer_secret
  
  # ==> Facebook
  config.facebook Settings.facebook.consumer_key, Settings.facebook.consumer_secret, :scope => 'publish_stream'
  
  if Rails.env.production?
    
    # Configs for production mode go here
    
  elsif Rails.env.development?
    
    # Configs for development mode go here
    
  end
  
end
