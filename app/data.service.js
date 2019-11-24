"use strict";
angular
    .module('app')
    .service('dataService', function ($http) {
        return {
            GetZones: function () {
                return $http.get('assets/data/zones.json');
            },
            GetTeam: function () {
                return $http.get('assets/data/team.json');
            },
            GetUsers: function () {
                return $http.get('assets/data/users.json').then((resp) => {
                    console.log("resp: ", resp, "data: ", resp.data);
                    return resp.data
                }).catch((_) => {return {}});
            }
        }
    });