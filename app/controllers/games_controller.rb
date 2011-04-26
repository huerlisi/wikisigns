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

  def create
    @word = Word.find_by_word(params[:guessed_word])
    won = true if @word
    user = current_user ? current_user : nil
    @word = Word.create(:word => params[:guessed_word], :user => user) unless @word
    @game = Game.create(:user => user, :word => @word, :input => params[:guessed_word], :won => won)
    @game.save
    @new_guess_word = Word.guess_random

    respond_to do |format|
      format.json {
        render :json => [@game, @new_guess_word]
      }
    end
  end
end
