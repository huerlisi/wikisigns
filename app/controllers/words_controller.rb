class WordsController < ApplicationController

  respond_to :html, :json

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

  # POST /words
  def create
    @word = Word.new(:word => params[:word].strip)
    @game = NewWordGame.create(:user => current_user || nil,
                               :word => @word,
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
    @word = Word.to_guess.random
    @messages = Word.latest(1)

    show!
  end

  # GET /words/random_messages
  def random_messages
    @word = Word.to_guess.random

    if params[:timestamp] and (params[:timestamp] != 'null')
      timestamp = Time.at(params[:timestamp].to_i)
      @messages = Word.where("created_at > ?", timestamp)
    else
      @messages = nil
    end

    new_timestamp = Word.last.created_at.to_i

    show! do |format|
      format.json {
        render :json => {:word => @word, :messages => @messages, :timestamp => new_timestamp}
      }
    end
  end

  # GET /words/inspiration
  def inspiration
    @words = Word.to_guess.random(99)

    index! do |format|
      format.html do
        render :layout => 'inspiration'
      end
    end
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
      format.html do
        render :layout => false
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

  def communication
    new! do |format|
      format.html do
        render 'new'
      end
    end
  end
end
