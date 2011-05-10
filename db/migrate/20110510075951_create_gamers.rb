class CreateGamers < ActiveRecord::Migration
  def self.up
    create_table :gamers do |t|
      t.string :name

      t.timestamps
    end
  end

  def self.down
    drop_table :gamers
  end
end
