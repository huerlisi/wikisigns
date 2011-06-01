class ShowWord < ActiveRecord::Base
  has_many :word
  belongs_to :show
end
