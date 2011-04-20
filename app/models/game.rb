class Game < ActiveRecord::Base
  belongs_to :user
  belongs_to :word

  after_create :calculate_score

  scope :today, where("created_at >= ? AND created_at < ?", Time.now.at_beginning_of_day, Time.now.tomorrow.at_beginning_of_day)

  def calculate_score
    self.score = 0
    self.score = 5 * rand(500) if won?
    # send_score

    self.save
  end
end
