WikiSigns::Application.routes.draw do |map|
  # Root
  root :to => "words#index"

  # Words
  resources :words, :except => :destroy
end
