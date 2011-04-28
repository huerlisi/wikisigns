class AddHelpedLettersToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :helped_letters, :integer, :default => 0

    Game.update_all(:helped_letters => 0)
  end

  def self.down
    remove_column :games, :helped_letters
  end
end
