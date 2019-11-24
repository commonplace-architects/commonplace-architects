"use strict";
angular
    .module('app')
    .service('authService', function ($window, dataService) {
        return {
            user: undefined,
            IsLoggedIn: function () {
                if (!this.user) {
                    this.user = JSON.parse($window.localStorage.getItem('common-place-user'));
                }

                return !!this.user;
            },
            LogIn: async function (user, password) {
                // Unsafe code as it is a demo and is fake auth
                let users = await dataService.GetUsers();
                console.log(users, user, password);

                if (!users[user]) {
                    return false;
                }

                if (users[user].password === password) {
                    $window.localStorage.setItem('common-place-user', JSON.stringify(users[user]));
                    this.user = users[user];
                    return true;
                }
            },
            LogOut: function () {
                this.user = undefined;
                $window.localStorage.removeItem('common-place-user')
            },
            IsStaff: function () {
                if (!this.user) {
                    return false;
                }

                return this.user.staff;
            }
        }
    });