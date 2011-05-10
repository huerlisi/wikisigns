module UsersHelper
    def merge_twitter_login_button
      content_tag(:a, 'Sign in with Twitter', :href => auth_request_path(:service => 'twitter'))
    end

    def merge_facebook_login_button
      content_tag(:a, 'Sign in with Facebook', :href => auth_request_path(:service => 'facebook'))
    end
end