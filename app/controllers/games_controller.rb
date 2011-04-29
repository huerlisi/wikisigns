class GamesController < ApplicationController

  layout 'game'

  respond_to :html, :json

  # Word game for guessing words.
  def new
    headers['Last-Modified'] = Time.now.httpdate
    @word = Word.guess_random
    expire_page :controller => 'games', :action => 'new'

    new!
  end

  # Creates a new game.
  def create
    @game = Game.create(:user => current_user ? current_user : nil, :input => params[:guessed_word], :helped_letters => params[:helped_letters])
    @game.save
    @new_guess_word = Word.guess_random

    respond_to do |format|
      format.json {
        render :json => [@game, @new_guess_word]
      }
    end
  end
end
