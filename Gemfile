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
  gem 'rspec-rails', "~> 2.5"
  gem 'rails3-generators'
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
  # Testing
  gem "rspec", "~> 2.5"
  gem 'rspec-rails', "~> 2.5"
  gem 'shoulda'

  # Fixtures
  gem "factory_girl_rails", "~>1.1.beta1"
  gem "factory_girl", "~>2.0.0.beta2"
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
gem 'omnisocial'
gem 'koala'
gem 'settingslogic'

# Generate images
gem 'imgkit'

# Monitoring
# ==========
group :production do
  # Google Analytics
  gem 'rack-google_analytics', :require => "rack/google_analytics"
  # Monitoring with new relic
  gem 'newrelic_rpm'
  # Hoptoad for error catching
  gem 'hoptoad_notifier'
end
