class FacebookController < ApplicationController
  def canvas
    redirect_to "/users/auth/facebook?signed_request=#{params['signed_request']}&state=canvas"
  end
end
