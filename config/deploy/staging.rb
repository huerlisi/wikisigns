set :rails_env, 'staging'
set :branch, "master"

set :deploy_to, '/srv/cyt.ch/wikisigns'
role :web, "test.wikisigns"                          # Your HTTP server, Apache/etc
role :app, "test.wikisigns"                          # This may be the same as your `Web` server
role :db,  "test.wikisigns", :primary => true        # This is where Rails migrations will run

