"use strict";
angular
    .module('app')
    .controller('AccountController', function($scope, $state, authService, user) {
        if (!user) {
            authService.LogOut();
            $state.go('home');
            return
        }

        $scope.user = user;
        console.log($scope.user);
    });