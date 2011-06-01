class ShowWord < ActiveRecord::Base
  belongs_to :word
  belongs_to :show
end
