class ShowsController < ApplicationController

  def new
    @show = Show.new(:user => user_signed_in? ? current_user : nil)
    @show.add_words(params[:words])
    @show.save

    new!
  end

  def show
    @word = Word.new(:word => '')

    show!
  end
end
