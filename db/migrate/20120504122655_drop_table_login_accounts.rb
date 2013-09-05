class DropTableLoginAccounts < ActiveRecord::Migration
  def self.up
    drop_table :login_accounts
  end
end
