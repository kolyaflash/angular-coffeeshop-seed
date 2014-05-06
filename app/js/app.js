'use strict';

var APP_SETTINGS = {
    'PROJECT_NAME': 'Coffee house',
};

// Declare app level module which depends on filters, and services
angular.module('testApp', [
  'ngRoute',
  'testApp.filters',
  'testApp.services',
  'testApp.directives',
  'testApp.controllers',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/orders', {templateUrl: 'partials/home.html', controller: 'HomePage'});
  $routeProvider.otherwise({redirectTo: '/orders'});
}]).
constant('appSettings', APP_SETTINGS).
run(['$rootScope', 'appSettings', function ($rootScope, appSettings) {
    // Provide data to the root scope bypassing controller.
    $rootScope.settings = appSettings;
}]);



// This module is for storing all data inside indexedDB.
/*
To access db - inject shopDatabase into your controller and use one of the CRUD methods to access data.

Available storages: 'orders'.
Available methods: create(obj), get(id), all(), update(obj), delete(id_or_obj)

Notice that shopDatabase.orders.all() didn't return array. This api is async, so
use .then() to access query result.

-- Usage example to query all orders with controller:

module.controller('TestCtrl', ['$scope', 'shopDatabase', function($scope, shopDatabase) {
  shopDatabase.orders.all().then(function (result) {
    // "result" is an array of all orders stored in the db.
    $scope.orders = result;
  });
});

-- to delete order:

shopDatabase.orders.delete($scope.order).then(function () {
    // this code will be executed when order was deleted.
});
*/
angular.module('appDatabase', ['xc.indexedDB'])
  .config(function ($indexedDBProvider) {
    $indexedDBProvider
      .connection('coffeeShopDb')
      .upgradeDatabase(1, function(event, db, tx){
        db.createObjectStore('orders', {keyPath: 'id', autoIncrement:true});
      });
  }).factory('shopDatabase', ['$indexedDB', function ($indexedDB) {

    var dbApi = function(objectStoreName) {
        var objectStore = $indexedDB.objectStore(objectStoreName);

        this.get = function(id) {
            return objectStore.find(id);
        },

        this.all = function() {
            return objectStore.getAll();
        },

        this.create = function(itemObj) {
            itemObj.created_date = new Date();
            return objectStore.insert(itemObj);
        },

        this.update = function(itemObj) {
            return objectStore.upsert(itemObj);
        },

        this.delete = function(idOrItemObj) {
            if (angular.isObject(idOrItemObj)) {
                return objectStore.delete(idOrItemObj.id);
            } else {
                return objectStore.delete(parseInt(idOrItemObj));
            }
        }
    };

    return {
        orders: new dbApi('orders'),
        deleteDb: function () {
            indexedDB.deleteDatabase("coffeeShopDb");
        },
    };
  }]);
