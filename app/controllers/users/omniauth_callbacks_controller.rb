class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController 
  # ----------------------------------
  # Following code is from: https://github.com/holden/devise-omniauth-example/blob/master/app/controllers/users/omniauth_callbacks_controller.rb
  # ---------------------------------- 
  def method_missing(provider)
    if !User.omniauth_providers.index(provider).nil?
      omniauth = env["omniauth.auth"]
      
      logger.info('--------------------------------------------')
      logger.info(omniauth.inspect)
      logger.info('--------------------------------------------')
    
      if current_user
        current_user.user_tokens.find_or_create_by_provider_and_uid(omniauth['provider'], omniauth['uid'])
        flash[:notice] = "Authentication successful"
        redirect_to edit_user_registration_path
      else
    
        authentication = UserToken.find_by_provider_and_uid(omniauth['provider'], omniauth['uid'])
   
        if authentication
          flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => omniauth['provider']
          if params[:state] == "canvas"
            sign_in(:user, authentication.user)
            redirect_to communication_words_path(:fb_canvas => true)
          else
            sign_in_and_redirect(:user, authentication.user)
          end
          #sign_in_and_redirect(authentication.user, :event => :authentication)
        else
          
          #create a new user
          unless omniauth.recursive_find_by_key("email").blank?
            user = User.find_or_initialize_by_email(:email => omniauth.recursive_find_by_key("email"))
          else
            user = User.new
          end
          
          user.apply_omniauth(omniauth)
          #user.confirm! #unless user.email.blank?

          if user.save(:validate => false)
            flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => omniauth['provider'] 
            if params[:state] == "canvas"
              sign_in(:user, user)
              redirect_to communication_words_path(:fb_canvas => true)
            else
              sign_in_and_redirect(:user, user)
            end
          else
            session[:omniauth] = omniauth.except('extra')
            redirect_to new_user_registration_url
          end
        end
      end
    end
  end  
end