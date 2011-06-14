class WelcomeController < ApplicationController
  ALPHABET = ('a'..'z').to_a.to_s

  def index
    @word = Word.new(:word => ALPHABET)
  end
end
