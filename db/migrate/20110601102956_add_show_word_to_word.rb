class AddShowWordToWord < ActiveRecord::Migration
  def self.up
    add_column :words, :show_word_id, :integer
  end

  def self.down
    remove_column :words, :show_word_id
  end
end
