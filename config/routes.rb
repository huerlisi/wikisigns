WikiSigns::Application.routes.draw do

  get "welcome/index", :as => 'welcome'

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  # Root
  root :to => 'welcome#index'

  match 'word/:slug', :to => 'words#show_by_slug'
  match 'word/:slug/publish', :to => 'words#publish'

  # Words
  resources :words, :except => [:destroy, :edit, :update] do
    collection do
      get  'random'
      get  'random_messages'
      get  'inspiration'
      get  'communication'
    end

    member do
      get 'svg'
    end

    resources :games, :only => [:create, :show]
  end

  resources :games, :only => [:new] do
    collection do
      get  'random_word'
    end
  end
  resources :shows, :only => [:new, :show]

  resources :users, :only => [:new, :edit, :show, :update] do
    member do
      post 'daily_score'
    end
  end
end
