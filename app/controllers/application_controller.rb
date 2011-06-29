class ApplicationController < ActionController::Base

  layout 'application'

  inherit_resources

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
end
