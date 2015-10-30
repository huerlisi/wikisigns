# Settings
# ========
source 'http://rubygems.org'

# Rails
# =====
gem 'rails', '~> 3.0'
gem 'rack'

# Database
gem 'sqlite3'
gem 'mysql2'

# Development
# ===========
group :development do
  # Haml generators
  gem 'hpricot'
  gem 'ruby_parser'

  # Deployment
  gem 'capones_recipes'
end

# Test
# ====
group :test do
  # Matchers/Helpers
  gem 'shoulda'

  # Mocking
  # gem 'mocha'

  # Browser
  gem 'capybara'

  # Autotest
  gem 'autotest'
  gem 'autotest-rails'
  gem 'ZenTest', '< 4.6.0' # Keep it working with gems < 1.8
end

group :test, :development do
  # Framework
  gem "rspec"
  gem 'rspec-rails'

  # Fixtures
  gem "factory_girl_rails"
  gem "factory_girl"

  # Integration
  # gem 'cucumber-rails'
  # gem 'cucumber'

  # Generators
  gem 'rails3-generators'
end

# Standard helpers
# ================
gem 'haml'
gem 'sass-rails'
gem 'compass-rails'
gem 'fancy-buttons'

gem 'simple-navigation'
gem 'simple_form'

gem 'lyb_sidebar'

gem 'formtastic'
#gem 'will_paginate', :git => 'git://github.com/huerlisi/will_paginate.git', :branch => 'rails3'
gem 'inherited_resources'
gem 'has_scope'
gem 'i18n_rails_helpers'

gem 'jquery-rails'

gem 'settingslogic'
gem 'routing-filter'

# Access Control
gem 'devise'
gem 'omniauth'

# Twitter
gem 'omniauth-twitter'

# Facebook
gem 'omniauth-facebook'
gem 'koala'


# Generate images
gem 'imgkit'

# Generates qr codes
gem 'rqrcode'

# Monitoring
# ==========
group :production do
  # Traffic
  gem 'rack-google_analytics'

  # Performance
  gem 'newrelic_rpm'

  # Exceptions
  gem 'airbrake'
end

gem "thin"
