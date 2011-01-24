class WordsController < InheritedResources::Base

  respond_to :html, :json

  # GET /words
  def index
    redirect_to new_word_path
  end

  # GET /words/new
  def new
    last_word = params[:last_word] || 'Willkommen'
    params[:word] ||= {:word => last_word}
    params[:word] = JSON.parse params[:word] if params[:word].is_a? String

    new!
  end
  
  # POST /words
  def create
    create! { new_word_path(:last_word => @word.word) }
  end
end
