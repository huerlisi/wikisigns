require 'cookbook/wikisigns'

#Application
set :application, "wikisigns"
set :repository,  "git@github.com:huerlisi/wikisigns.git"

# Staging
set :stages, %w(production staging)
set :default_stage, "staging"
require 'capistrano/ext/multistage'

# Deployment
set :server, :passenger
set :user, "deployer"                               # The server's user for deploys

# Configuration
set :scm, :git
ssh_options[:forward_agent] = true
set :use_sudo, false
set :deploy_via, :remote_cache
set :git_enable_submodules, 1
set :copy_exclude, [".git", "spec"]


require 'hoptoad_notifier/capistrano'
