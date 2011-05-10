module ApplicationHelper
  def is_facebook_request?
    ('words'.eql?controller_name and 'new_word'.eql?action_name) ? true : false
  end

  def has_a_gamer_name?(user)
    true
  end
end
