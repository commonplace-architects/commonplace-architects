"use strict";
angular
    .module('app')
    .controller('TopLevelController', function ($scope, $state, authService) {
        $scope.loggedIn = authService.IsLoggedIn();
        $scope.switch_clicked = (event) => {
            event.preventDefault();
            $('.toggle').toggleClass('toggle-on');
        };

        $scope.openNav =() => {
            $('#small-screen-nav').width("100%");
        };
        $scope.closeNav =() => {
            $('#small-screen-nav').width("0%");
        };

        $scope.logOut = () => {
            authService.LogOut();
            $scope.loggedIn = false;
            if ($state.is('account')) {
                $state.go('home');
            }
        };

        $scope.form = {
            user: '',
            password: ''
        };

        $scope.loading = false;
        $scope.modal_errors = '';
        $scope.tryLogin = TryLogin;

        $('#loginModal').on('show.bs.modal', function (e) {
            $scope.form.user = '';
            $scope.form.password = '';
            $scope.$apply();
        });

        function TryLogin(event) {
            event.preventDefault();

            $scope.loggedIn = false;
            $scope.modal_errors = '';

            $scope.loading = true;
            authService.LogIn($scope.form.user, $scope.form.password)
                .then((loggedIn) => {
                    $scope.loading = false;
                    console.log("Here: ", loggedIn, authService.user);

                    if (!loggedIn) {
                        console.log("Failed to login");
                        $scope.modal_errors = 'Invalid user or password';
                        return;
                    }

                    $scope.loggedIn = true;
                    $('#loginModal').modal('hide');
                    if (authService.IsStaff()) {
                        console.log("Staff page not done");
                        return;
                    }

                    console.log("State: ", $state);
                    $state.go('account');
                });

        }
    });
