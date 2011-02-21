Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, Settings.facebook.consumer_key, Settings.facebook.consumer_secret
  provider :twitter, Settings.twitter.consumer_key, Settings.twitter.consumer_secret
end