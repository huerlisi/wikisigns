Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, Settings.facebook.consumer_key, Settings.facebook.consumer_secret
end