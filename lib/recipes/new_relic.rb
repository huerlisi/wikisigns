before "deploy:setup", :new_relic
after "deploy:update_code", "new_relic:symlink"

namespace :new_relic do
  desc "Create application yaml in capistrano shared path"
  task :default do
    run "mkdir -p #{shared_path}/config"
    upload "config/newrelic.yml.example", "#{shared_path}/config/newrelic.yml", :via => :scp
  end

  desc "Make symlink for shared application yaml"
  task :symlink do
    run "ln -nfs #{shared_path}/config/newrelic.yml #{release_path}/config/newrelic.yml"
  end
end