WikiSigns::Application.routes.draw do

  get "welcome/index", :as => 'welcome'

  devise_for :users
  
  # Root
  root :to => 'welcome#index'

  match 'word/:slug', :to => 'words#show_by_slug'

  # Words
  resources :words, :except => [:destroy, :edit, :update] do
    collection do
      get  'random'
      get  'guess'
      post 'new_word'
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
