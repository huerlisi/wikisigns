class ApplicationController < ActionController::Base

  protect_from_forgery :except => :new_word
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
