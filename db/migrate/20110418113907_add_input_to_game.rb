class AddInputToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :input, :string
  end

  def self.down
    remove_column :games, :input
  end
end
