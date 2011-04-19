class AddWonToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :won, :boolean, :default => false
  end

  def self.down
    remove_column :games, :won
  end
end
