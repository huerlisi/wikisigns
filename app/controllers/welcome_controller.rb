class WelcomeController < ApplicationController
  def index
    @word = Word.last
  end
end
