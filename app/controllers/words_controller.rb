class WordsController < InheritedResources::Base
  # GET /words
  def index
    @word = Word.new(:word => 'Willkommen')

    index!
  end

  # GET /words/1
  def show
    redirect_to words_path
  end

  # PUT /words/1
  def update
    unless params[:word][:next_word]
      @word = Word.find(params[:id])
    else
      @word = Word.create(params[:word])
    end

    update!
  end
end
