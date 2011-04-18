class GamesController < ApplicationController

  layout 'game'

  before_filter :user_facebook?, :except => 'search'

  # Word game for guessing words.
  def new
    headers['Last-Modified'] = Time.now.httpdate
    @word = Word.guess_random
    expire_page :controller => 'words', :action => 'game'

    new!
  end

  # Search after a word when it doesn't exists a entry is created.
  def search
    @word = Word.find_by_word(params[:guessed_word])
    @word = Word.create!(:word => params[:guessed_word], :user => current_user) unless @word

    show!
  end

end
