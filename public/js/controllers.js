'use strict';

/* Controllers */

var dreamsControllers = angular.module('dreamsControllers', []);

dreamsControllers.controller('AppCtrl', ['$scope', 'Log', 'Logout', 'Dream',
    function AppCtrl($scope, Log, Logout, Dream) {

        // Variables
        $scope.isLogged = false;
        $scope.data = {};
        $scope.page = 1;
        $scope.previous = false;
        $scope.next = false;

        /* Initial log */
        Log.get({},
            function success(response) {
                $scope.isLogged = response.auth;
            },
            function error(errorResponse) {
                console.log("Error:" + JSON.stringify(errorResponse));
            }
        );

        /* Pagination */
        $scope.paginate = function (direction) {
            if (direction === 'previous')
                --$scope.page;
            else if (direction === 'next')
                ++$scope.page;
            Dream.get({page: $scope.page},
                function success(response) {
                    $scope.data = response.data;
                    $scope.previous = response.prev_page_url;
                    $scope.next = response.next_page_url;
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };

        /* Initial page */
        $scope.paginate();

        /* Logout */
        $scope.logout = function () {
            Logout.get({},
                function success() {
                    $scope.isLogged = false;
                    $.each($scope.data, function(key) {
                        $scope.data[key].is_owner = false;
                    });
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };

        /* Edit Dream */
        $scope.edit = function (id, index) {
            $scope.errorContent = null;
            $scope.id = $scope.data[index].id;
            $scope.content = $scope.data[index].content;
            $scope.index = index;
            $('#myModal').modal();
        };

        /* Destroy Dream  */
        $scope.destroy = function (id) {
            if (confirm("Really delete this dream ?"))
            {
                Dream.delete({id: id},
                    function success() {
                        $scope.paginate();
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                    }
                );
            }
        };

        /* Update Dream */
        $scope.submitChange = function () {
            $scope.errorContent = null;
            Dream.update({id: $scope.id}, {content: $scope.content},
                function success(response) {
                    $scope.data[$scope.index].content = $scope.content;
                    $('#myModal').modal('hide');
                },
                function error(errorResponse) {
                    $scope.errorContent = errorResponse.data.content[0];
                }
            );
        };

    }]);

dreamsControllers.controller('LoginCtrl', ['$scope', 'Login',
    function LoginCtrl($scope, Login) {
        $scope.isAlert = false;

        /* Login */
        $scope.submit = function () {
            $scope.errorEmail = null;
            $scope.errorPassword = null;
            $scope.isAlert = false;
            Login.save({}, $scope.formData,
                function success(response) {
                    if (response.result === 'success') {
                        $scope.$parent.isLogged = true;
                        $scope.$parent.paginate();
                        window.location = '#page-top';
                    } else {
                        $scope.isAlert = true;
                    }
                },
                function error(errorResponse) {
                    if (errorResponse.data.password) {
                        $scope.errorPassword = errorResponse.data.password[0];
                    }
                    if (errorResponse.data.email) {
                        $scope.errorEmail = errorResponse.data.email[0];
                    }
                }
            );
        };

    }]);

dreamsControllers.controller('DreamCtrl', ['$scope', 'Dream',
    function DreamCtrl($scope, Dream) {

        /* Create Dream */
        $scope.submitCreate = function () {
            $scope.errorCreateContent = null;
            Dream.save({}, $scope.formData,
                function success(response) {
                    $scope.formData.content = null;
                    $scope.$parent.page = 1;
                    $scope.$parent.data = response.data;
                    $scope.$parent.previous = response.prev_page_url;
                    $scope.$parent.next = response.next_page_url;
                    window.location = '#dreams';
                },
                function error(errorResponse) {
                    $scope.errorCreateContent = errorResponse.data.content[0];
                }
            );
        };

    }]);



