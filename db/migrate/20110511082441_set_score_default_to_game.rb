class SetScoreDefaultToGame < ActiveRecord::Migration
  def self.up
    change_column :games, :score, :integer, :default => 0
    Game.update_all "score = 0", "score IS NULL"
  end

  def self.down
  end
end
