angular.module('immopoly.services',['ionic', 'ngCordova'])

.factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },

            remove: function(key) {
                localStorage.removeItem(key);
            },

            clearAll: function() {
                localStorage.clear();
            }
        }
    }]);