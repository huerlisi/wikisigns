class UsersController < ApplicationController

  def daily_score
    @user = User.find(params[:id])

    render :json => @user.post_score_to_fb_wall
  end

end