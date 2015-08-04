// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('immopoly', ['ionic', 'immopoly.controllers', 'immopoly.services', 'immopoly.directives', 'immopoly.filters','ngCordova'])
.constant('myConfig', {
  'API_PATH': 'http://www.immopolyapp.com/gestion/api/'
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
}])

.config(function($stateProvider, $urlRouterProvider) {
  // openFB.init({appId: '1619280068338977'});
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.preload', {
    url: "/preload",
    views: {
      'menuContent': {
        templateUrl: "templates/preload.html",
          controller:'preloadCtrl'
      }
    }
  })
  
  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html"
      }
    }
  })
  .state('app.mdp', {
    url: "/mdp",
    views: {
      'menuContent': {
        templateUrl: "templates/mdp.html"
      }
    }
  })
  .state('app.inscription', {
    url: "/inscription",
    views: {
      'menuContent': {
        templateUrl: "templates/inscription.html"
      }
    }
  })
  .state('app.chat', {
    url: "/chat/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/chat.html"
      }
    }
  })
  .state('app.list_chat', {
    url: "/list_chat",
    views: {
      'menuContent': {
        templateUrl: "templates/list_chat.html"
      }
    }
  })
  .state('app.detail', {
    url: "/detail/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/detail.html"
      }
    }
  })
  .state('app.favoris', {
    url: "/favoris",
    views: {
      'menuContent': {
        templateUrl: "templates/favoris.html"
      }
    }
  })
  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })
  .state('app.result_search', {
    url: "/result_search",
    views: {
      'menuContent': {
        templateUrl: "templates/result_search.html"
      }
    }
  })
  .state('app.page', {
    url: "/page",
    views: {
      'menuContent': {
        templateUrl: "templates/page.html"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
