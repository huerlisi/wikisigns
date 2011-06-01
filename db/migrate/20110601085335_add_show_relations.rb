class AddShowRelations < ActiveRecord::Migration
  def self.up
    add_column :words, :show_id, :integer
  end

  def self.down
    remove_column :words, :show_id
  end
end
