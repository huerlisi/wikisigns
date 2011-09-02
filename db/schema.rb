# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110901131218) do

  create_table "assets", :force => true do |t|
    t.string   "file"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cms_blocks", :force => true do |t|
    t.integer  "page_id"
    t.string   "label"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cms_blocks", ["page_id", "label"], :name => "index_cms_blocks_on_page_id_and_label"

  create_table "cms_layouts", :force => true do |t|
    t.integer  "site_id"
    t.integer  "parent_id"
    t.string   "app_layout"
    t.string   "label"
    t.string   "slug"
    t.text     "content"
    t.text     "css"
    t.text     "js"
    t.integer  "position",   :default => 0,     :null => false
    t.boolean  "is_shared",  :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cms_layouts", ["parent_id", "position"], :name => "index_cms_layouts_on_parent_id_and_position"
  add_index "cms_layouts", ["site_id", "slug"], :name => "index_cms_layouts_on_site_id_and_slug", :unique => true

  create_table "cms_pages", :force => true do |t|
    t.integer  "site_id"
    t.integer  "layout_id"
    t.integer  "parent_id"
    t.integer  "target_page_id"
    t.string   "label"
    t.string   "slug"
    t.string   "full_path"
    t.text     "content"
    t.integer  "position",       :default => 0,     :null => false
    t.integer  "children_count", :default => 0,     :null => false
    t.boolean  "is_published",   :default => true,  :null => false
    t.boolean  "is_shared",      :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cms_pages", ["parent_id", "position"], :name => "index_cms_pages_on_parent_id_and_position"
  add_index "cms_pages", ["site_id", "full_path"], :name => "index_cms_pages_on_site_id_and_full_path"

  create_table "cms_revisions", :force => true do |t|
    t.string   "record_type"
    t.integer  "record_id"
    t.text     "data"
    t.datetime "created_at"
  end

  add_index "cms_revisions", ["record_type", "record_id", "created_at"], :name => "index_cms_revisions_on_record_type_and_record_id_and_created_at"

  create_table "cms_sites", :force => true do |t|
    t.string  "label"
    t.string  "hostname"
    t.string  "path"
    t.string  "locale",      :default => "en",  :null => false
    t.boolean "is_mirrored", :default => false, :null => false
  end

  add_index "cms_sites", ["hostname"], :name => "index_cms_sites_on_hostname"
  add_index "cms_sites", ["is_mirrored"], :name => "index_cms_sites_on_is_mirrored"

  create_table "cms_snippets", :force => true do |t|
    t.integer  "site_id"
    t.string   "label"
    t.string   "slug"
    t.text     "content"
    t.boolean  "is_shared",  :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cms_snippets", ["site_id", "slug"], :name => "index_cms_snippets_on_site_id_and_slug", :unique => true

  create_table "cms_uploads", :force => true do |t|
    t.integer  "site_id"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cms_uploads", ["site_id", "file_file_name"], :name => "index_cms_uploads_on_site_id_and_file_file_name"

  create_table "contents", :force => true do |t|
    t.integer  "position"
    t.text     "content"
    t.integer  "localized_page_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "type"
  end

  create_table "gamers", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", :force => true do |t|
    t.integer  "score",          :default => 0
    t.integer  "word_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "input"
    t.boolean  "won",            :default => false
    t.integer  "helped_letters", :default => 0
    t.string   "type"
  end

  create_table "localized_pages", :force => true do |t|
    t.string   "title"
    t.string   "slug"
    t.string   "keywords"
    t.text     "description"
    t.text     "body"
    t.integer  "published"
    t.string   "locale"
    t.integer  "page_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "url"
    t.text     "fulltext"
    t.string   "page_type"
    t.datetime "published_at"
  end

  create_table "login_accounts", :force => true do |t|
    t.string   "type"
    t.integer  "user_id"
    t.string   "remote_account_id"
    t.string   "name"
    t.string   "login"
    t.string   "picture_url"
    t.string   "access_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "login_accounts", ["type"], :name => "index_login_accounts_on_type"
  add_index "login_accounts", ["user_id"], :name => "index_login_accounts_on_user_id"

  create_table "pages", :force => true do |t|
    t.integer  "position"
    t.integer  "parent_id"
    t.integer  "page_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "show_words", :force => true do |t|
    t.integer  "show_id"
    t.integer  "word_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "shows", :force => true do |t|
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context"
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type", "context"], :name => "index_taggings_on_taggable_id_and_taggable_type_and_context"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                               :default => "",    :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "",    :null => false
    t.string   "reset_password_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.datetime "last_facebook_post"
    t.boolean  "cms_admin",                           :default => false
    t.string   "login_type"
    t.string   "access_token"
  end

  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "words", :force => true do |t|
    t.string   "word"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "next_word"
    t.integer  "user_id"
    t.integer  "show_id"
    t.integer  "show_word_id"
  end

end
