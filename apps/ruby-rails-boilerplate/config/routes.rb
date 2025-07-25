Rails.application.routes.draw do
  get 'password_resets/new'
  get 'password_resets/edit'
  get 'confirmations/new'

  get '/help', to: 'static_pages#help'
  get '/about', to: 'static_pages#about'
  get '/contact', to: 'static_pages#contact'
  get '/signup', to: 'users#new'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  get '/my-account', to: 'users#show'
  get '/my-account/order-history', to: 'orders#edit'
  get '/my-account/profile', to: 'users#edit'

  resources :users do
    member do
      get :following
      get :followers
    end
  end

  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]
  resources :confirmations,       only: [:new, :create]
  resources :microposts,          only: [:create, :destroy]
  resources :relationships,       only: [:create, :destroy]

  resources :rooms do
    resources :messages
  end

  get '/microposts', to: 'microposts#home'

  resources :products, only: [:index, :show] do
    resources :reviews
  end

  resources :cart_items, only: [:create, :update, :destroy]
  resources :guest_cart_items, only: [:create, :update, :destroy]
  get 'cart', to: 'cart#index'

  resources :wish_items, only: [:create, :destroy]
  resources :guest_wish_items, only: [:create, :destroy]
  get 'wish', to: 'wish#index'

  resources :orders
  get 'checkout1', to: 'orders#checkout1'
  get 'checkout2', to: 'orders#checkout2'
  get 'checkout3', to: 'orders#checkout3'
  get 'checkout4', to: 'orders#checkout4'
  get 'checkout5', to: 'orders#checkout5'
  get 'addresses', to: 'addresses#index'

  namespace :admin do
    root 'static_pages#home'
    resources :users
    resources :products
    resources :orders
  end

  namespace :api, format: "json" do
    root 'static_pages#home'

    resources :sessions, only: [:index]
    delete '/logout', to: 'sessions#destroy'
    post '/login', to: 'sessions#create'
    post '/refresh', to: 'sessions#refresh'
    post '/revoke', to: 'sessions#revoke'

    resources :users do
      member do
        get :following
        get :followers
      end
    end

    resources :account_activations, only: [:create, :update]
    resources :password_resets, only: [:create, :update]
    resources :microposts, only: [:create, :destroy]
    resources :post_medias, only: [:create, :destroy]
    resources :posts, only: [:create, :destroy]
    resources :relationships, only: [:create, :destroy]

    namespace :v1 do
      get "users", to: "users#index"
      get "products", to: "products#index"
      get "wish", to: "wish#index"
      get "cart", to: "cart#index"
    end

    resources :products do
      collection do
        get :filters
      end
    end

    resources :reviews, only: [:create, :update, :destroy]
    resources :cart_items, only: [:create, :update, :destroy]
    resources :guest_cart_items, only: [:create, :update, :destroy]
    resources :cart, only: [:index]
    resources :wish, only: [:index]
    resources :wish_items, only: [:create, :destroy]
    resources :guest_wish_items, only: [:create, :destroy]
    resources :orders
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
  get '/health', to: 'application#health'

  # GraphQL endpoint
  post "/graphql", to: "graphql#execute"
  post '/api/ai/chat', to: 'api/ai#chat'

  # Catch-all for SPA routing
  get '*path', to: 'application#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
