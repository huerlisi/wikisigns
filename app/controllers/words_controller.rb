class WordsController < ApplicationController

  respond_to :html, :json

  # Layout
  layout :words_layout

  def words_layout
    case self.action_name
      when 'show', 'new', 'random', 'svg'
        'wikisigns'
      when 'new_word'
        'facebook'
      else
        'application'
    end
  end

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
    @word ||= Word.new(:word => params[:slug])

    @previous_word = Word.where("id < ?", @word.id).order(:id).last
    @previous_word ||= Word.last

    @next_word = Word.where("id > ?", @word.id).order(:id).first
    @next_word ||= Word.first

    show! do |format|
      format.jpg do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440,
                                                   :format => 'jpg', :quality => 60).to_img,
                                                   :type => image_content_type("jpeg", params[:download]),
                              :disposition => disposition(params[:download]) )
      end
      format.png do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440,
                                                   :format => 'png', :quality => 60).to_img,
                                                   :type => image_content_type("png", params[:download]),
                              :disposition => disposition(params[:download]) )
      end
      format.html { render 'show' }
    end
  end
  
  # GET /words
  def index
    redirect_to new_word_path
  end

  # GET /words/new
  def new
    last_word = params[:last_word] || ''
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
    @game = NewWordGame.create(:user => current_user || nil,
                               :input => params[:word].strip)
    create! do |format|
      format.html {
        new_word_path(:last_word => @game.word.word)
      }
      format.json {
        render :json => @game.score
      }
    end
  end

  # GET /words/random
  def random
    @word = Word.random

    show!
  end

  def guess
    headers['Last-Modified'] = Time.now.httpdate
    @word = Word.guess_random
    expire_page :controller => 'games', :action => 'new'

    show!
  end

  # Is here for rendering a svg to a JPG or PNG file.
  # GET /words/:id/svg
  # format: png or jpg
  def svg
    show! do |format|
      format.jpg do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440,
                                                   :format => 'jpg', :quality => 60).to_img,
                                                   :type => image_content_type("jpeg", params[:download]),
                              :disposition => disposition(params[:download]) )
      end
      format.png do
        send_data( IMGKit.new(svg_word_url(@word), :'crop-w' => 440,
                                                   :format => 'png', :quality => 60).to_img,
                                                   :type => image_content_type("png", params[:download]),
                              :disposition => disposition(params[:download]) )
      end
    end
  end

  # Publishes the picture to the users facebook photo album.
  def publish
    if current_user && user_signed_in? && current_user.from_facebook?
      @word = Word.find_by_word(params[:slug])
      @word ||= Word.new(:word => params[:slug])

      file_path = "#{Rails.root}/tmp/#{@word.id}_#{@word.word}.png"
      IMGKit.new(svg_word_url(@word), :'crop-w' => 440, :format => 'png', :quality => 60).to_file(file_path)
      current_user.publish_on_fb(file_path, @word.word)
    end

    redirect_to :root
  end
end
