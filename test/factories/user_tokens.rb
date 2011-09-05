# Read about factories at http://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user_token do
      user_id 1
      provider "MyString"
      uid "MyString"
    end
end