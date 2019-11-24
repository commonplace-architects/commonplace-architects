"use strict";
angular
    .module('app')
    .controller('HomeController', function($scope, $state, zones, team) {
        $scope.zones = zones;
        $scope.team = team;
        $scope.zone_clicked = (name) => {
            $state.go('community', {communityName: name}, {});
        }
    });