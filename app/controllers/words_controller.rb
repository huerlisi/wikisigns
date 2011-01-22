class WordsController < ApplicationController
  # GET /words
  def index
    @word = Word.new(:word => 'Willkommen')

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @word }
    end
  end

  # GET /words/1
  def show
    @word = Word.find(params[:id])

    respond_to do |format|
      format.html { render 'index' }
      format.xml  { render :xml => @word }
    end
  end

  # GET /words/new
  def new
    @word = Word.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @word }
    end
  end

  # GET /words/1/edit
  def edit
    @word = Word.find(params[:id])
  end

  # POST /words
  def create
    @word = Word.new(params[:word])

    respond_to do |format|
      if @word.save
        format.html { redirect_to(@word, :notice => 'Word was successfully created.') }
        format.xml  { render :xml => @word, :status => :created, :location => @word }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @word.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /words/1
  def update
    unless params[:word][:next_word]
      @word = Word.find(params[:id])
    else
      @word = Word.create(params[:word])
    end

    respond_to do |format|
      if @word.update_attributes(params[:word])
        format.html { redirect_to(@word, :notice => 'Word was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @word.errors, :status => :unprocessable_entity }
      end
    end
  end
end
