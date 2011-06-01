class CreateShowWords < ActiveRecord::Migration
  def self.up
    create_table :show_words do |t|
      t.integer :show_id
      t.integer :word_id

      t.timestamps
    end
  end

  def self.down
    drop_table :show_words
  end
end
