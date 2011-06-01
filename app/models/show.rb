class Show < ActiveRecord::Base
  belongs_to :user
  has_many :show_words
  has_many :words, :through => :show_words

  def add_words(ids)
    ids.each do |id|
      show_words << ShowWord.new(:word_id => id.to_i)
    end
  end
end
