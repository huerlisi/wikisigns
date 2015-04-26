# Application
set :application, "wikisigns"
set :repository,  "git@github.com:huerlisi/wikisigns.git"

require 'capones_recipes/cookbook/rails'
require 'capones_recipes/tasks/settings_logic'
require 'capones_recipes/tasks/database/setup'
require 'capones_recipes/tasks/sync'
require 'capones_recipes/tasks/new_relic'
require 'capones_recipes/tasks/airbrake'
require 'capones_recipes/tasks/bluepill'

# Staging
set :default_stage, "staging"

# Deployment
set :user, "deployer"                               # The server's user for deploys

# Shared directories
set :shared_children, shared_children + ['tmp/sockets']

# Sync directories
set :sync_directories, ['uploads']
set :sync_backups, 3

# Configuration
set :scm, :git
ssh_options[:forward_agent] = true
set :use_sudo, false
set :deploy_via, :remote_cache
set :git_enable_submodules, 1
set :copy_exclude, [".git", "spec"]
