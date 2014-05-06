'use strict';

/* Controllers */

angular.module('testApp.controllers', ['appDatabase']).
  controller('HomePage', ['$scope', 'shopDatabase', function($scope, shopDatabase) {

    // A local var not accessible in view (HTML).
    var menu = {
        beverages: [
            {'name': 'Americano', 'price': 1.7},
            {'name': 'Café Crema', 'price': 1.3},
            {'name': 'Caffé Latte', 'price': 1.4},
            {'name': 'Cappuccino', 'price': 1.2},
            {'name': 'Espresso', 'price': 1},
            {'name': 'Frappuccino', 'price': 1.4},
            {'name': 'Iced Coffee', 'price': 1},
            {'name': 'Liqueur coffee', 'price': 1}
        ],

        liqueurs: [
            {'name': 'Whiskey', price: 0.5},
            {'name': 'Brandy', price: 0.6},
            {'name': 'Gin', price: 0.7},
        ]
    };
    // Use $scope to provide data to view (HTML).
    $scope.menu = menu;

    $scope.orders = [];
    $scope.newOrder = {};

    // Data binding expression could be a function!
    // Pay total <span/> content will be updated when you change $scope.newOrder.beverageType
    // in either controller or view.
    $scope.payTotal = function () {
        var toPay = 0;

        if ($scope.newOrder && $scope.newOrder.beverageType) {
            toPay += $scope.newOrder.beverageType.price;
        }

        return toPay;
    };

    $scope.submitForm = function () {
        $scope.newOrder.totalPrice = $scope.payTotal();

        shopDatabase.orders.create($scope.newOrder).then(function (createdId) {
            if (createdId) {
                $scope.newOrder.id = createdId;
                $scope.orders.push($scope.newOrder);

                // Clear form and make it pristine
                $scope.newOrder = {};
                $scope.addOrderForm.$setPristine();
            }
        });
    };

    // Get all (asynchronously) orders from db and update scope.
    shopDatabase.orders.all().then(function(orderItems) {
        $scope.orders = orderItems;
    });


  }])
  .controller('OrderDetail', ['$scope', function($scope) {

    /*
        Use `shopDatabase` service from `appDatabase` to get, update and delete order.
    */

  }]);
