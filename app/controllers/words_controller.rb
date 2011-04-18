class WordsController < InheritedResources::Base

  respond_to :html, :json
  layout :words_layout

  before_filter :user_facebook?, :only => ['game', 'game_search']

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

  def show_by_slug
    @word = Word.find_by_word(params[:slug])
    @word ||= Word.new(:word => 'not found')
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

  # Creates a new word.
  def new_word
    new
  end
  
  # POST /words
  def create
    create! { new_word_path(:last_word => @word.word) }
  end

  # GET /words/random
  def random
    @word = Word.random

    show!
  end

  # Is here for rendering a svg to a JPG or PNG file.
  # GET /words/:id/svg
  # format: png or jpg
  def svg
    show! do |format|
      format.jpg do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440, :format => 'jpg', :quality => 60).to_img, :type => image_content_type("jpeg", params[:download]), :disposition => disposition(params[:download]) )
      end
      format.png do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440, :format => 'png', :quality => 60).to_img, :type => image_content_type("png", params[:download]), :disposition => disposition(params[:download]) )
      end
    end
  end

  # Word game for guessing words.
  def game
    headers['Last-Modified'] = Time.now.httpdate
    @word = Word.guess_random
    expire_page :controller => 'words', :action => 'game'

    show!
  end

  # Search after a word when it doesn't exists a entry is created.
  def game_search
    @word = Word.find_by_word(params[:guessed_word])
    @word = Word.create!(:word => params[:guessed_word], :user => current_user) unless @word

    show!
  end

  private

  def user_facebook?
    redirect_to root_path unless user_signed_in? && current_user.from_facebook?
  end

  def image_content_type(format, download = nil)
    download ? 'application/x-download' : "image/#{format}"
  end

  def disposition(download = nil)
    download ? 'attachement' : 'inline'
  end

  def words_layout
    action = self.action_name

    if 'random'.eql?action or 'show'.eql?action or 'svg'.eql?action
      return nil
    end

    if 'new_word'.eql?action
      return 'facebook'
    end

    if 'game'.eql?action
      return 'game'
    end

    'application'
  end
  
end
