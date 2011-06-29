class GamesController < ApplicationController
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
    @word = Word.find(params[:word_id])
    @game = @word.games.create(:user => current_user || nil,
                        :input => params[:guessed_word].strip,
                        :helped_letters => params[:helped_letters])

    @new_guess_word = Word.guess_random

    respond_to do |format|
      format.json {
        render :json => [@game, @new_guess_word]
      }
    end
  end

  # GET /words/random
  def random_word
    @word = Word.guess_random

    respond_with @word
  end
end
