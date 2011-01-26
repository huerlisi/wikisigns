module ApplicationHelper
  def is_facebook_request?
    ('words'.eql?controller_name and 'new_word'.eql?action_name) ? true : false
  end
end
