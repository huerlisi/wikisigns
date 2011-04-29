class AddDefaultScoreToGame < ActiveRecord::Migration
  def self.up
    change_column_default :games, :score, :default => 0
  end

  def self.down
  end
end
