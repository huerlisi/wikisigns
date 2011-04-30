# Only configure if Gem is loaded.
# This handles hoptoad-less test and development environments
if Object.const_defined? :HoptoadNotifier
  HoptoadNotifier.configure do |config|
    config.api_key = Settings.hoptoad
  end
end
