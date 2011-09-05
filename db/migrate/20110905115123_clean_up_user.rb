class CleanUpUser < ActiveRecord::Migration
  def self.up
    remove_column :users, :login_type
    remove_column :users, :access_token 
  end

  def self.down
    add_column :users, :login_type, :string
    add_column :users, :access_token, :string
  end
end
