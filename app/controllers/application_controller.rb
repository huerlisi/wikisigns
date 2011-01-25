class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'application'

  def verify_authenticity_token
    super unless request_comes_from_facebook?
  end
end
