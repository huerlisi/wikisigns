class AddLastFacebookPostToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :last_facebook_post, :datetime
  end

  def self.down
    remove_column :users, :last_facebook_post
  end
end
