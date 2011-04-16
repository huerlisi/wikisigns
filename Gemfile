# Settings
# ========
source 'http://rubygems.org'

# Rails
# =====
gem 'rails', '~> 3.0.0'

# Database
gem 'sqlite3-ruby', :require => 'sqlite3'
gem 'mysql'

# Development
# ===========
group :development do
  gem 'rails3-generators'
  gem 'rspec-rails', "~> 2.1"
  # Haml generators
  gem 'hpricot'
  gem 'ruby_parser'
  gem 'rcov'

  # Deployment
  gem 'capistrano'
  gem 'capistrano-ext'
  gem 'cap-recipes'
end

# Test
# ====
group :test do
  gem 'rspec-rails', "~> 2.1"
  gem 'mocha'
  gem 'shoulda'
  gem 'factory_girl_rails'
  gem 'cucumber-rails'
  gem 'cucumber'
  gem 'webrat'
end

# Standard helpers
# ================
gem 'haml'
gem 'compass', '~> 0.10.6'
gem 'fancy-buttons'

gem 'simple-navigation'

gem 'lyb_sidebar'

gem 'formtastic', '~> 1.2.1'
gem 'will_paginate', :git => 'git://github.com/huerlisi/will_paginate.git', :branch => 'rails3'
gem 'inherited_resources'
gem 'has_scope'
gem 'i18n_rails_helpers', '~> 0.9'

gem 'jquery-rails'

# Facebook and Twitter authentication
gem 'devise', :git => 'git://github.com/plataformatec/devise.git', :branch => 'v1.2.oauth'
#gem 'omniauth'
#gem "oa-oauth", :require => "omniauth/oauth"
gem 'omnisocial'
gem 'settingslogic'

# Generate images
gem 'imgkit'

# Google Analytics
# ===========
group :production do
  gem 'rack-google_analytics', :require => "rack/google_analytics"
end
