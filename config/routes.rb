WikiSigns::Application.routes.draw do

  get "welcome/index", :as => 'welcome'

  devise_for :users
  # Routes from omnisocial cause of the cms routes.
  match 'login'                  => 'omnisocial/auth#new',      :as => :login
  match 'auth/:service/callback' => 'omnisocial/auth#callback'
  match 'auth/failure'           => 'omnisocial/auth#failure'
  match 'logout'                 => 'omnisocial/auth#destroy',  :as => :logout

  # Root
  root :to => 'welcome#index'

  match 'word/:slug', :to => 'words#show_by_slug'

  # Words
  resources :words, :except => [:destroy, :edit, :update] do
    collection do
      get  'random'
    end

    member do
      get 'svg'
      get 'publish'
    end

    resources :games, :only => [:create, :show]
  end

  resources :games, :only => [:new] do
    collection do
      get  'random_word'
    end
  end
  resources :shows, :only => [:new, :show]

  resources :users, :only => [:edit, :show, :update] do
    member do
      post 'daily_score'
    end
  end
end
