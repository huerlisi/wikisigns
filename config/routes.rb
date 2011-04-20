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
    end
    member do
      get 'svg'
    end

    resources :games, :only => [:create, :show]
  end

  resources :games, :only => [:new]

  resources :users, :only => [] do
    member do
      post 'daily_score'
    end
  end
end
