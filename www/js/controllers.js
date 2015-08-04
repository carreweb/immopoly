angular.module('immopoly.controllers', ['ionic', 'ngCordova', 'ionic.contrib.ui.tinderCards'])

.controller('AppCtrl', function($scope, $ionicPopup, $ionicPlatform, $ionicLoading, $ionicModal, $interval, $timeout, myConfig, $http, $localstorage, $state, $rootScope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});


    $ionicPlatform.ready(function() {
        alert('ionicPlatform');
        console.log(window.PushbotsPlugin);
        if (window.PushbotsPlugin) {
            alert('PushbotsPlugin');
            if (PushbotsPlugin.isiOS()) {
                alert('isiOS');
                PushbotsPlugin.initializeiOS("55a92cbe177959c2368b456d");
                PushbotsPlugin.resetBadge();
                PushbotsPlugin.setBadge(0);
                PushbotsPlugin.debug(true);
            }
            if (PushbotsPlugin.isAndroid()) {
                alert('isAndroid');
                PushbotsPlugin.initializeAndroid("55a92cbe177959c2368b456d", "157451075286");
            }
            PushbotsPlugin.getToken(function(token) {
                alert(token);
            });
        }
        // loaded();
    });



    // Form data for the login modal
    
    $scope.loginData = {};
    $scope.inscription = {};
    $scope.mdp = {};


     
    $scope.giveMecount = function() {
        if ($localstorage.get('logged')) {
            var path_nombre_favoris = myConfig.API_PATH + "favoris/nombre/" + $localstorage.get('id_user');
            $http.get(path_nombre_favoris).then(function(resp) {
                if (resp.data) {
                    $rootScope.nombre_favoris = resp.data.nombre_favoris;
                    $rootScope.nombre_message_non_lus = resp.data.msg;
                }
            });
        }
    }
    // $interval($scope.giveMecount, 1000);


    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };
    //go to inscription
    $scope.gotomdp = function() {
        $state.go('app.mdp');
    };
    $scope.authError = false;
    $scope.gotoinscription = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        // Try to login
        $http.post(myConfig.API_PATH + 'login/inscription', $scope.inscription)
            .then(function(response) {
                $ionicLoading.hide();
                if (response.data.status) {
                    $localstorage.set('logged', true);
                    $localstorage.set('id_user', response.data.info.id);
                    $localstorage.set('nom', response.data.info.nom);
                    $localstorage.set('email', response.data.info.email);
                    $localstorage.set('picture', response.data.info.picture);
                    $localstorage.set('id_facebook', response.data.info.id_facebook);
                    $localstorage.set('agence_id', response.data.info.agence_id);
                    $state.go('app.page');
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Inscription',
                        template: 'Adresse e-mail déjà inscrite.'
                    });
                    alertPopup.then(function(res) {
                        $scope.inscription.email = '';
                    });

                }
            }, function(x) {
                $scope.authError = 'Server Error';
            });
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };


    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.authError = null;
        // Try to login
        $http.post(myConfig.API_PATH + 'login/connect', $scope.loginData)
            .then(function(response) {
                $ionicLoading.hide();
                if (response.data.status) {
                    $localstorage.set('logged', true);
                    $localstorage.set('id_user', response.data.info.id);
                    $localstorage.set('nom', response.data.info.nom);
                    $localstorage.set('email', response.data.info.email);
                    $localstorage.set('picture', response.data.info.picture);
                    $localstorage.set('id_facebook', response.data.info.id_facebook);
                    $localstorage.set('agence_id', response.data.info.agence_id);
                    $state.go('app.page');
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Connexion',
                        template: 'Email ou mot de passe incorrect.'
                    });

                }
            }, function(x) {
                $scope.authError = 'Server Error';
            });
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
    $scope.gotosearch = function() {
        $state.go('app.result_search');
    };
    $scope.loginwithfacebook = function() {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        facebookConnectPlugin.login(["email"], function(response) {
            if (response.authResponse) {
                $ionicLoading.hide();
                facebookConnectPlugin.api('/me', null,
                    function(response) {
                        console.log('Good to see you, ' + response.name + '.');
                        $rootScope.userinfos = {
                            "nom": response.name,
                            "prenom": response.first_name,
                            "email": response.email,
                            "id_facebook": response.id,
                            "avatar": 'http://graph.facebook.com/' + response.id + '/picture?width=270&height=270'
                        };
                        $http.post(myConfig.API_PATH + 'login/loginwithfacebook', $rootScope.userinfos)
                            .then(function(response) {
                                if (response.data.status) {
                                    $localstorage.set('logged', true);
                                    $localstorage.set('id_user', response.data.info.id);
                                    $localstorage.set('nom', response.data.info.nom);
                                    $localstorage.set('email', response.data.info.email);
                                    $localstorage.set('picture', response.data.info.picture);
                                    $localstorage.set('id_facebook', response.data.info.id_facebook);
                                    $localstorage.set('agence_id', response.data.info.agence_id);
                                    // alert("UserInfo: " + JSON.stringify($rootScope.userinfos));
                                    $state.go('app.page');
                                } else {
                                    $scope.authError = 'Email or Password not right';
                                }
                            }, function(x) {
                                $scope.authError = 'Server Error';
                            });
                        // alert("UserInfo: " + JSON.stringify($rootScope.userinfos));

                    });
            }
        });

    };
    $scope.sucess_send = false;
    $scope.givemeMdp = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        // Try to login
        $http.post(myConfig.API_PATH + 'login/recuperer', $scope.mdp)
            .then(function(response) {
                $ionicLoading.hide();
                if (response.data.status) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Mot de passe oublie',
                        template: 'Votre mot de passe a été envoyé par email.'
                    });
                    alertPopup.then(function(res) {
                        $state.go('app.login');
                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Erreur!',
                        template: 'Cette adresse email n\'existe pas dans notre base de données.'
                    });

                }
            }, function(x) {
                $scope.authError = 'Server Error';
            });
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})




.controller('preloadCtrl', function($state,$scope, $ionicLoading, $http, myConfig,$sce,$ionicPlatform,$localstorage,$ionicHistory) {

    $ionicPlatform.ready(function() {
        alert('ionicPlatform');
        console.log(window.PushbotsPlugin);
        if (window.PushbotsPlugin) {
            alert('PushbotsPlugin');
            if (PushbotsPlugin.isiOS()) {
                alert('isiOS');
                PushbotsPlugin.initializeiOS("55a92cbe177959c2368b456d");
                PushbotsPlugin.resetBadge();
                PushbotsPlugin.setBadge(0);
                PushbotsPlugin.debug(true);
            }
            if (PushbotsPlugin.isAndroid()) {
                PushbotsPlugin.initializeAndroid("55a92cbe177959c2368b456d", "157451075286");
            }
            PushbotsPlugin.getToken(function(token) {
                alert(token);
            });
        }
        loaded();
    });


  

  function loaded(){
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.login');
  }


})

    
    .controller('CardsCtrl', function($scope, $state, $rootScope, TDCardDelegate, myConfig, $http, $ionicLoading, $localstorage, $ionicPopup) {
        

        //SHOW LOADING
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        //INIT AND LOAD

        var cardsData = [];
        $scope.cards = [];
        var increment = 1;
        var path = myConfig.API_PATH + "annonces/list/" + $localstorage.get('id_user');
        $http.get(path).then(function(resp) {
            if (resp.data) {
                $ionicLoading.hide();
                cardsData = resp.data.aaData;
                $scope.cards = Array.prototype.slice.call(cardsData, 0);
                $scope.elementselected = $scope.cards[$scope.cards.length - 1];
                $scope.elementindex = $scope.cards.length - 1;
            }
        });

        //TD CARDS FUNCTIONS

        $scope.addCard = function() {
            var newCard = cardsData[Math.floor(Math.random() * cardsData.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }

        // for(var i = 0; i < 3; i++) $scope.addCard();
 
        $scope.cardSwipedLeft = function(index) {
            console.log('Left swipe');
        }
     
        $scope.cardSwipedRight = function(index) {
            console.log('Right swipe');
        }
     
        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            console.log('Card removed');
        }

        // $scope.cardSwipedLeft = function(index) {
        //     console.log('jarjini LEFT SWIPE' + index);
        //     console.log($scope.cards[index - 1]);
        //     // $scope.addCard();

        // };
        // $scope.cardSwipedRight = function(index) {
        //     console.log('jarjini1 LEFT SWIPE' + index);
        //     console.log($scope.cards[index - 1]);
        //     // $scope.addCard();
        // };

        // $scope.addCard = function(index) {
        //     $scope.cards.splice(index, 1);
        // }



        // CARDS ACTION FUNCTIONS 
        $scope.gotoNext = function(index) {
            $scope.elementindex = index - 1;
            $scope.elementselected = $scope.cards[index - 1];
            $scope.addCard(index);
        };

        $scope.addtoFavorit = function(element) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.favoris_add = {};
            $scope.favoris_add.id_user = $localstorage.get('id_user');
            $scope.favoris_add.id_annonce = element.id;
            if ($scope.elementselected.favoris) {
                $scope.favoris_add.type = false;
                var path_delete = myConfig.API_PATH + "favoris/delete/" + element.favoris;
                $http.get(path_delete).then(function(resp) {
                    if (resp.data) {
                        $ionicLoading.hide();
                        $scope.elementselected.favoris = false;
                    }
                });
            } else {
                $scope.favoris_add.type = true;
                $http.post(myConfig.API_PATH + 'favoris/add_favoris', $scope.favoris_add)
                    .then(function(response) {
                        if (response.data.status) {
                            $http.get(path).then(function(resp) {
                                if (resp.data) {
                                    $ionicLoading.hide();
                                    $scope.elementselected.favoris = response.data.id;


                                }
                            });

                        }
                    });
            }
        }


        $scope.chatter = function(index) {
            $scope.conversations = {};
            $scope.conversations.id_annonce = $scope.elementselected.id;
            $scope.conversations.utilisateur_id = $scope.elementselected.utilisateur_id;
            $scope.conversations.id_user = $localstorage.get('id_user');
            var confirmPopup = $ionicPopup.confirm({
                title: 'Contactez',
                cancelText: 'Maintenant',
                okText: 'Aprés',
                template: 'voulez vous créer message?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $http.post(myConfig.API_PATH + 'messagerie/add_conversations', $scope.conversations)
                        .then(function(response) {
                            if (response.data.status) {
                                $ionicLoading.hide();
                                //$state.go("app.chat",{id:response.data.message});
                            }
                        });
                } else {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $http.post(myConfig.API_PATH + 'messagerie/add_conversations', $scope.conversations)
                        .then(function(response) {
                            if (response.data.status) {
                                $ionicLoading.hide();
                                $state.go("app.chat", {
                                    id: response.data.message
                                });
                            }
                        });
                }
            });
        };

    })

    
    .controller('resultCtrl', function($scope, TDCardDelegate, myConfig, $http, $filter, $rootScope, $ionicLoading, $localstorage, $ionicPopup, $state) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var cardTypes = [];
        var path = myConfig.API_PATH + "annonces/list/" + $localstorage.get('id_user');
        $http.get(path).then(function(resp) {
            if (resp.data) {
                var list_after_filter = $filter('filterAnnonces')(resp.data.aaData, $rootScope.search);
                $ionicLoading.hide();
                $scope.cards = Array.prototype.slice.call(list_after_filter, 0);
                $scope.elementselected = $scope.cards[$scope.cards.length - 1];
                $scope.elementindex = $scope.cards.length - 1;
            }
        });
        $scope.addCard = function(index) {
            $scope.cards.splice(index, 1);
        }
        $scope.gotoNext = function(index) {
            $scope.elementindex = index - 1;
            $scope.elementselected = $scope.cards[index - 1];
            $scope.addCard(index);
        };
        $scope.addtoFavorit = function(element) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.favoris_add = {};
            $scope.favoris_add.id_user = $localstorage.get('id_user');
            $scope.favoris_add.id_annonce = element.id;
            if ($scope.elementselected.favoris) {
                $scope.favoris_add.type = false;
                var path_delete = myConfig.API_PATH + "favoris/delete/" + element.favoris;
                $http.get(path_delete).then(function(resp) {
                    if (resp.data) {
                        $ionicLoading.hide();
                        $scope.elementselected.favoris = false;
                    }
                });
            } else {
                $scope.favoris_add.type = true;
                $http.post(myConfig.API_PATH + 'favoris/add_favoris', $scope.favoris_add)
                    .then(function(response) {
                        if (response.data.status) {
                            $http.get(path).then(function(resp) {
                                if (resp.data) {
                                    $ionicLoading.hide();
                                    $scope.elementselected.favoris = response.data.id;
                                }
                            });

                        }
                    });
            }
        }
        $scope.cardSwipedLeft = function(index) {
            console.log('jarjini LEFT SWIPE' + index);
            console.log($scope.cards[index - 1]);
            $scope.elementselected = $scope.cards[index - 1];

        };
        $scope.cardSwipedRight = function(index) {
            console.log('jarjini1 LEFT SWIPE' + index);
            console.log($scope.cards[index - 1]);
            $scope.elementselected = $scope.cards[index - 1];
        };
        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.chatter = function(index) {
            $scope.conversations = {};
            $scope.conversations.id_annonce = $scope.elementselected.id;
            $scope.conversations.utilisateur_id = $scope.elementselected.utilisateur_id;
            $scope.conversations.id_user = $localstorage.get('id_user');
            var confirmPopup = $ionicPopup.confirm({
                title: 'Contactez',
                cancelText: 'Maintenant',
                okText: 'Aprés',
                template: 'voulez vous créer message?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $http.post(myConfig.API_PATH + 'messagerie/add_conversations', $scope.conversations)
                        .then(function(response) {
                            if (response.data.status) {
                                $ionicLoading.hide();
                                //$state.go("app.chat",{id:response.data.message});
                            }
                        });
                } else {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $http.post(myConfig.API_PATH + 'messagerie/add_conversations', $scope.conversations)
                        .then(function(response) {
                            if (response.data.status) {
                                $ionicLoading.hide();
                                $state.go("app.chat", {
                                    id: response.data.message
                                });
                            }
                        });
                }
            });
        };

        /*  $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
          }*/
    })
    //controller add annonce
    .controller('addAnnonce', function($scope, $rootScope, myConfig, $http, $localstorage, $ionicLoading, geolocation) {

        console.log(geolocation);
    })
    //controller list chat
    .controller('listChat', function($scope, $rootScope, myConfig, $http, $localstorage, $ionicLoading) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var path = myConfig.API_PATH + "messagerie/list/" + $localstorage.get('id_user');
        $http.get(path).then(function(resp) {
            if (resp.data) {
                $ionicLoading.hide();
                $scope.conversations = resp.data.all;
            }
        });

    })
    //detail ctrl annonce
    .controller('DetailCtrl', function($scope, $rootScope, myConfig, $http, $localstorage, $stateParams, $ionicSlideBoxDelegate, $ionicLoading, $state, $ionicPopup) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.send = {};
        $scope.send.message = '';
        $scope.send.id_sender = $localstorage.get('id_user');
        $scope.send.annonce_id = $stateParams.id;
        $scope.showMore = false;

        var path = myConfig.API_PATH + "annonces/element/" + $stateParams.id + "/" + $localstorage.get('id_user');
        $http.get(path).then(function(resp) {
            if (resp.data) {
                $ionicLoading.hide();
                $scope.annonce = resp.data.aaData;
                $ionicSlideBoxDelegate.update();
            }
        });


        $scope.addtoFavorit = function(element) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.favoris_add = {};
            $scope.favoris_add.id_user = $localstorage.get('id_user');
            $scope.favoris_add.id_annonce = element.id;
            if ($scope.annonce.favoris) {
                $scope.favoris_add.type = false;
                var path_delete = myConfig.API_PATH + "favoris/delete/" + element.favoris;
                $http.get(path_delete).then(function(resp) {
                    if (resp.data) {
                        $ionicLoading.hide();
                        $scope.annonce.favoris = false;
                    }
                });
            } else {
                $scope.favoris_add.type = true;
                $http.post(myConfig.API_PATH + 'favoris/add_favoris', $scope.favoris_add)
                    .then(function(response) {
                        if (response.data.status) {
                            $http.get(path).then(function(resp) {
                                if (resp.data) {
                                    $ionicLoading.hide();
                                    $scope.annonce.favoris = response.data.id;
                                }
                            });

                        }
                    });
            }
        }

        //chatter
        $scope.chatter = function(index) {
            $scope.conversations = {};
            $scope.conversations.id_annonce = $scope.annonce.id;
            $scope.conversations.utilisateur_id = $scope.annonce.utilisateur_id;
            $scope.conversations.id_user = $localstorage.get('id_user');
            var confirmPopup = $ionicPopup.confirm({
                title: 'Contactez',
                cancelText: 'Maintenant',
                okText: 'Aprés',
                template: 'voulez vous créer message?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $http.post(myConfig.API_PATH + 'messagerie/add_conversations', $scope.conversations)
                        .then(function(response) {
                            if (response.data.status) {
                                $ionicLoading.hide();
                                //$state.go("app.chat",{id:response.data.message});
                            }
                        });
                } else {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $http.post(myConfig.API_PATH + 'messagerie/add_conversations', $scope.conversations)
                        .then(function(response) {
                            if (response.data.status) {
                                $ionicLoading.hide();
                                $state.go("app.chat", {
                                    id: response.data.message
                                });
                            }
                        });
                }
            });
        };

    })
    //ctrl favoris
    .controller('favorisCtrl', function($scope, $rootScope, myConfig, $http, $localstorage, $ionicLoading) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var path = myConfig.API_PATH + "favoris/list/" + $localstorage.get('id_user');
        $http.get(path).then(function(resp) {
            if (resp.data) {
                $ionicLoading.hide();
                $scope.favoris = resp.data.all;
            }
        });
        $scope.deleteFavorite = function(id) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var path_delete = myConfig.API_PATH + "favoris/delete/" + id;
            $http.get(path_delete).then(function(resp) {
                if (resp.data) {
                    var path = myConfig.API_PATH + "favoris/list/" + $localstorage.get('id_user');
                    $http.get(path).then(function(resp) {
                        if (resp.data) {
                            $ionicLoading.hide();
                            $scope.favoris = resp.data.all;
                        }
                    });
                }
            });
        };

    })
    //detail chat
    .controller('detailChat', function($ionicLoading, $scope, $rootScope, myConfig, $http, $localstorage, $stateParams) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.send = {};
        $scope.send.message = '';
        $scope.send.id_sender = $localstorage.get('id_user');
        $scope.send.conver_id = $stateParams.id;

        var path = myConfig.API_PATH + "messagerie/conversation/" + $stateParams.id + "/" + $localstorage.get('id_user');
        $http.get(path).then(function(resp) {
            if (resp.data) {
                $ionicLoading.hide();
                $scope.messagerie = resp.data.conversation;
                $scope.annonce = resp.data.info_annonce;
                $scope.send.user_reception = resp.data.autre_user;
            }
        });
        $scope.faitunereponse = function() {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $http.post(myConfig.API_PATH + 'messagerie/send_message', $scope.send)
                .then(function(response) {
                    if (response.data.status) {
                        $http.get(path).then(function(resp) {
                            if (resp.data) {
                                $ionicLoading.hide();
                                $scope.messagerie = resp.data.conversation;
                                $scope.send.user_reception = resp.data.autre_user;
                            }
                        });
                        $scope.send.message = '';
                    }
                });
        };

    })
    .controller('searchCtrl', function($ionicLoading, $scope, $rootScope, myConfig, $http) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $rootScope.search = {};
        $rootScope.search.achat = true;
        $rootScope.search.location = true;
        $rootScope.search.ma_position = false;
        var path = myConfig.API_PATH + "annonces/config_list";
        $http.get(path).then(function(resp) {
            if (resp.data) {

                $rootScope.search.distance = 100;
                $rootScope.search.max = resp.data.max;
                $rootScope.search.budget = 100;

            }
        });
        var path_cat = myConfig.API_PATH + "annonces/categories";
        $http.get(path_cat).then(function(resp) {
            if (resp.data) {
                $ionicLoading.hide();
                $rootScope.search.list_cat = resp.data.aaData;
            }
        });

        //search app
    })
    .controller('loginCtrl', function($scope, $rootScope, myConfig, $http, $localstorage, $ionicLoading, $state) {

        if ($localstorage.get('logged') != undefined || $localstorage.get('logged')) {
            //$state.go('app.page');
        }
    })
    .controller('CardCtrl', function($scope, TDCardDelegate) {

    });