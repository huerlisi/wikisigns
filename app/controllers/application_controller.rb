class ApplicationController < ActionController::Base
  protect_from_forgery :except => :new_word
  layout 'application'
end
