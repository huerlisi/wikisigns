class AddGamerToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :gamer_id, :integer
  end

  def self.down
    remove_column :users, :gamer_id
  end
end
