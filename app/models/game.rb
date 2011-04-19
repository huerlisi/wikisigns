class Game < ActiveRecord::Base
  belongs_to :user
  belongs_to :word

  after_create :calculate_score

  def calculate_score
    score = 0
    score = 5 * rand(500) if won?
    # send_score

    save
  end

  private

  def send_score
    graph = Koala::Facebook::GraphAPI.new(self.user.access_token)
    graph.put_wall_post(I18n.t('game.message.score.text', :score => self.score),
                                                          { "name" => "WikiSigns.ch - The Game",
                                                            "link" => "http://wikisigns.ch/game/new",
                                                            "caption" => "{*actor*} spielte auf WikiSigns.ch das Wortratespiel.",
                                                            "description" => "Probier es einfach auch mal aus.",
                                                            "picture" => "http://wikisigns.ch/words/#{word.id}/svg.jpg"})
  end
end
