class AddNextWordToWord < ActiveRecord::Migration
  def self.up
    add_column :words, :next_word, :integer
  end

  def self.down
    remove_column :words, :next_word
  end
end
