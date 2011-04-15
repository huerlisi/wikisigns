WikiSigns::Application.routes.draw do

  devise_for :users

#  get '/auth/twitter/callback' do
#    auth_hash = request.env['omniauth.auth']
#  end
#  match "/auth/:provider/callback" => "devise/sessions#create"
  
  # Root
  root :to => "words#index"

  match 'word/:slug', :to => 'words#show_by_slug'

  # Words
  resources :words, :except => [:destroy, :edit, :update] do
    collection do
      get  'random'
      post 'new_word'
      get  'game'
      post 'game_search'
    end
    member do
      get 'svg'
    end
  end
end
