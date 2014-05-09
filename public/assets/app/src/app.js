define(function(require, exports, module) {

	'use strict';
	
	var ext = require('./ext.js');

	var angular = require('angularjs');
	require('angularjs-resource');

	// app
	var app = window.app = angular.module('app', [ 'ngResource' ]);
	app.fixHttp = [
        '$httpProvider',
        function($httpProvider) {
            function errorcatcher($q) {
                function success(response) {
                    return response;
                }

                function error(response) {
                    ext.handlerror(response);
                    return $q.reject(response);
                }

                return function(promise) {
                    return promise.then(success, error);
                };
            }
            $httpProvider.responseInterceptors.push(['$q', errorcatcher]);
        }
    ];
    app.config(app.fixHttp);

	// dialog directive
	app.d_appDialog = [ '$http', function($http) {
		var func = function($scope, $element, $attrs) {
			var url = $attrs.url;
			var trigger = $attrs.trigger || 'click';
			$element.bind(trigger, function() {
				var dlg = art.dialog({
					'id' : url
				});

				$http({
					method : 'GET',
					url : url
				}).success(function(r) {
					dlg.content(r);
				});
			});
		};

		return {
			link : func,
			restrict : 'A'
		};
	} ];
	app.directive('appDialog', app.d_appDialog);

	app.d_appProfile = ['$http',function($http){
		var func = function($scope,$element,$attrs){
			$http({method:'GET',url:'/auth/check'}).success(function(r){
				$scope.result = r.result;
				$scope.user = r.user;
				$scope.mnum = r.mnum || 0 ;
			});
		};

		return {link:func,restrict:'E',scope:{},replace:true,templateUrl:'/profile.html'};
	}];

	app.directive('appProfile',app.d_appProfile);

	exports.fixHttp = app.fixHttp;
	exports.init = function() {
		angular.bootstrap(document.body, [ 'xhub.app.Index' ]);
	};
});