define(function(require, exports, module) {

    'use strict';

    var angular = require('angularjs');
    require('angularjs-resource');
    var app = require('app');
    var mod = angular.module('notice', ['app']);

    // TODO
    mod.d_noticeList = ['$http',
        function($http) {
            var func = function($scope, $element, $attrs) {
                $http({
                    method: 'GET',
                    url: '/private/notice/list/' + $scope.page + '.json'
                }).success(function(r) {
                    $scope.result = r.result;
                    $scope.user = r.user;
                    $scope.mnum = r.mnum || 0;
                });
            };

            return {
                link: func,
                restrict: 'E',
                replace: true,
                transclude: true,
                controller: ['$scope', '$resource',
                    function($scope, $resource) {
                        $scope.notices = [];
                        $scope.page = 0;
                        $scope.count = 0;
                        $scope.loading = false;

                        $scope.nextPage = function() {
                            $scope.page++;
                        };

                        $scope.$watch('page', function(p) {
                            $scope.loading = true;

                            $http({
                                method: 'GET',
                                url: '/private/notice/list/' + $scope.page + '.json'
                            }).success(function(r) {
                                var ns = r.notices || [];
                                for(var i in ns){
                                    $scope.notices.push(ns[i]);
                                }
                                $scope.count = r.count;
                            }).then(function() {
                                $scope.loading = false;
                            });
                        });

                        $scope.page = 1;
                    }
                ],
                templateUrl: '/notice/app_notice_list.html'
            };
        }
    ];

    mod.directive('appNoticeList', mod.d_noticeList);


    mod.d_notice = ['$http',
        function($http) {
            var func = function($scope, $element, $attrs) {

            };

            return {
                link: func,
                restrict: 'E',
                replace: true,
                templateUrl: '/notice/app_notice_item.html'
            };
        }
    ];

    mod.directive('appNotice', mod.d_notice);
});
