class AddLoginTypeToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :login_type, :string
  end

  def self.down
    remove_column :users, :login_type
  end
end
