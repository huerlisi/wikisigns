class FacebookController < ApplicationController
  def canvas
    redirect_to "/fb_canvas/users/auth/facebook?signed_request=#{params['signed_request']}&state=canvas"
  end
end
