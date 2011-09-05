class UsersController < ApplicationController

  def daily_score
    @user = User.find(params[:id])

    @user.graph(session[:omniauth]["credentials"]["token"]).put_wall_post(I18n.t('game.message.score.text', :score => @user.daily_score),
                                                          { "name" => "WikiSigns.ch - The Game",
                                                            "link" => new_game_url,
                                                            "caption" => "{*actor*} spielte auf WikiSigns.ch das Wortratespiel.",
                                                            "description" => "Probier es einfach auch mal aus.",
                                                            "picture" => svg_word_url(@user.games.last.word, :format => :jpg)})
    @user.last_facebook_post = Date.today
    @user.save

    render :json => @user
  end

end
