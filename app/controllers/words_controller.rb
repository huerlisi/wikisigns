class WordsController < InheritedResources::Base

  respond_to :html, :json
  layout :words_layout

  # Cache the actions svg and show.
  caches_action :svg, :show

  def show
    @word = Word.find(params[:id])
    @previous_word = Word.where("id < ?", @word.id).order(:id).last
    @previous_word ||= Word.last
    
    @next_word = Word.where("id > ?", @word.id).order(:id).first
    @next_word ||= Word.first
    
    show!
  end
  
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
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440, :format => 'jpg', :quality => 60).to_img, :type => "image/jpeg", :disposition => 'inline' )
      end
      format.png do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440, :format => 'png', :quality => 60).to_img, :type => "image/png", :disposition => 'inline' )
      end
    end
  end

  private

  def words_layout
    action = self.action_name

    if 'random'.eql?action or 'show'.eql?action or 'svg'.eql?action
      return nil
    end

    if 'new_word'.eql?action
      return 'facebook'
    end

    'application'
  end
  
end
