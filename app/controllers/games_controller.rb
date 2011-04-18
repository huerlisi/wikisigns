class GamesController < ApplicationController

  layout 'game'

  respond_to :html, :json

  before_filter :user_facebook?, :except => 'search'

  # Word game for guessing words.
  def new
    headers['Last-Modified'] = Time.now.httpdate
    @word = Word.guess_random
    expire_page :controller => 'games', :action => 'new'

    new!
  end

  def create
    @word = Word.find_by_word(params[:guessed_word])
    @word = Word.create(:word => params[:guessed_word], :user => current_user) unless @word
    @game = Game.create(:user => current_user, :word => @word, :input => params[:guessed_word])
    @game.save
    @new_guess_word = Word.guess_random

    respond_to do |format|
      format.json {
        render :json => [@game, @new_guess_word]
      }
    end
  end

  # Search after a word when it doesn't exists a entry is created.
  def search
    @word = Word.find_by_word(params[:guessed_word])
    @word = Word.create!(:word => params[:guessed_word], :user => current_user) unless @word

    @word.to_json
  end

end
