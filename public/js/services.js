'use strict';

/* Services */

var dreamsServices = angular.module('dreamsServices', ['ngResource']);

dreamsServices.factory('Log', ['$resource',
    function ($resource) {
        return $resource("auth/log", {}, {
            get: {method: 'GET'}
        });
    }]);

dreamsServices.factory('Login', ['$resource',
    function ($resource) {
        return $resource("auth/login", {}, {
            save: {method: 'POST'}
        });
    }]);

dreamsServices.factory('Logout', ['$resource',
    function ($resource) {
        return $resource("auth/logout", {}, {
            get: {method: 'GET'}
        });
    }]);

dreamsServices.factory('Dream', ['$resource',
    function ($resource) {
        return $resource("dream/:id", {page: '@page'}, {
            get: {method: 'GET'},
            save: {method: 'POST'},
            delete: {method: 'DELETE'},
            update: {method: 'PUT'}
        });
    }]);




