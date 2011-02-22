class WordsController < InheritedResources::Base

  respond_to :html, :json
  layout 'application', :except => [:random, :show, :svg]

  # GET /words
  def index
    redirect_to new_word_path
  end

  # GET /words/new
  def new
    last_word = params[:last_word] || 'Symbol'
    params[:word] ||= {:word => last_word}
    params[:word] = JSON.parse params[:word] if params[:word].is_a? String

    new!
  end

  def new_word
    new
  end
  
  # POST /words
  def create
    create! { new_word_path(:last_word => @word.word) }
  end

  # GET /words/random
  def random
    @word = Word.first(:order => "RANDOM()")
    show!
  end

  def svg
    show! do |format|
      format.jpg do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440).to_img, :type => "image/jpeg", :disposition => 'inline' )
      end
      format.png do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440, :format => 'png' ).to_img, :type => "image/png", :disposition => 'inline' )
      end
    end
  end
end
