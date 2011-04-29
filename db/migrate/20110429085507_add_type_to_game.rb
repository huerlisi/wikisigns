class AddTypeToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :type, :string
  end

  def self.down
    remove_column :games, :type
  end
end
