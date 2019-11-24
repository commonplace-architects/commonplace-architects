"use strict";
angular
    .module('app', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');
        $stateProvider.state(
            'home', {
                url: '/home?scrollTo',
                templateUrl: 'app/home.html',
                controller: 'HomeController',
                onEnter: function ($location, $stateParams, $anchorScroll, $timeout) {
                    if ($stateParams.scrollTo === '') {
                        return;
                    }

                    $timeout(function () {
                        $location.hash($stateParams.scrollTo);
                        $anchorScroll();
                    }, 100);
                },
                resolve: {
                    zones: function (dataService) {
                        return dataService.GetZones()
                            .then((resp) => {
                                return resp.data;
                            })
                            .catch((resp) => {
                                console.error(resp.data);
                                return [];
                            });
                    },
                    team: function (dataService) {
                        return dataService.GetTeam()
                            .then((resp) => {
                                return resp.data;
                            })
                            .catch((resp) => {
                                console.error(resp.data);
                                return [];
                            });
                    }
                }
            }
        )
            .state(
                'community',
                {
                    url: '/community/:communityName',
                    templateUrl: 'app/community.html',
                    controller: 'CommunityController',
                    resolve: {
                        community: function ($stateParams, dataService) {
                            return dataService.GetZones()
                                .then((resp) => {
                                    return resp.data.filter((zone) => {
                                        return (zone["name"] === $stateParams.communityName) && $stateParams.communityName !== "";
                                    });
                                })
                                .catch((resp) => {
                                    console.error(resp.data);
                                    return [];
                                });
                        }
                    }
                }
            )
            .state('account',
                {
                    url:'/account',
                    templateUrl: 'app/account_page.html',
                    controller: 'AccountController',
                    resolve: {
                        user: function (authService) {
                            return authService.user;
                        }
                    }
                });
    });

