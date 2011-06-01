WikiSigns::Application.routes.draw do

  devise_for :users
  
  # Root
  root :to => "words#index"

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

  resources :games, :only => [:new]

  resources :shows, :only => [:new, :show]

  resources :users, :only => [:edit, :show, :update] do
    member do
      post 'daily_score'
    end
  end
end
