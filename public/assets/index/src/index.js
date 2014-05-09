define(function(require, exports, module) {


    var $ = require('jquery');
    var angular = require('angularjs');
    require('angularjs-resource');
    require('app');
    var ext = require('ext');

    'use strict';

    var index = angular.module('xhub.Index', ['ngResource','app']);

    index.directive('password', function() {
        return {
            require: 'ngModel',
            link: function($scope, $element, $attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var el = document.getElementById($attrs['password']);
                    var pw = el.value;
                    if (viewValue && viewValue == pw) {
                        $scope.regForm.confirmPassword.$setValidity(
                            'confirmed', true);
                        return viewValue;
                    } else {
                        $scope.regForm.confirmPassword.$setValidity(
                            'confirmed', false);
                        return viewValue;
                    }
                });
            }
        };
    });

    index.directive('confirmPassword', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var el = document.getElementById(attrs['confirmPassword']);
                    var pw = el.value;
                    if (pw && pw == viewValue) {
                        ctrl && ctrl.$setValidity('confirmed', true);
                        return viewValue;
                    } else {
                        ctrl && ctrl.$setValidity('confirmed', false);
                        return viewValue;
                    }
                });
            }
        };
    });

    index.CheckingLogin = [
        '$scope',
        '$resource',
        '$routeParams', '$location',
        function($scope, $resource, $routeParams, $location) {
            var actions = {
                check: {
                    method: 'GET',
                    responseType: 'json'
                }
            };
            var Checker = $resource('/auth/check', {}, actions);

            $scope.checkingLogin = function() {
                Checker.check({}, function(resp) {
                    if (resp.result) {
                        $location.path('/login/success').search({
                            id: resp.user.id,
                            nickName: resp.user.nickName
                        });
                    } else {
                        $location.path('/login');
                    }
                });
            };

            $scope.checkingLogin();
        }
    ];
    index.controller('xhub.Index.CheckingLogin', index.CheckingLogin);

    index.CheckingLoginSuccess = ['$scope', '$resource', '$routeParams',
        function($scope, $resource, $routeParams) {
            $scope.id = $routeParams.id;
            $scope.email = $routeParams.email;
            $scope.nickName = $routeParams.nickName;
        }
    ];
    index.controller('xhub.Index.CheckingLoginSuccess',
        index.CheckingLoginSuccess);

    index.Invite = [
        '$scope',
        '$resource',
        '$routeParams',
        '$http',
        '$location',
        function($scope, $resource, $routeParams, $http, $location) {
            $scope.email = $routeParams.email || '';
            $scope.failure = undefined;
            $scope.inviting = false;
            $scope.focused = false;

            var actions = {
                invite: {
                    method: 'POST',
                    responseType: 'json'
                }
            };
            var Inviter = $resource('/auth/invite', {}, actions);

            $scope.invite = function() {
                $scope.inviting = true;
                $scope.failure = undefined;

                Inviter.invite({
                    'email': $scope.email
                }, function(resp) {
                    if (!resp.result) {
                        $scope.inviting = false;
                        $scope.failure = '邮箱不可用或者已经被占用，请换个地址试试';
                        // $scope.email = undefined;
                    } else {
                        $location.path('/invite/success').search({
                            'email': $scope.email
                        });
                    }
                });
            };

            $scope.isvalid = function() {
                return $scope.email && $scope.email.length >= 8;
            };
        }
    ];
    index.controller('xhub.Index.Invite', index.Invite);

    index.InviteSuccess = ['$scope', '$resource', '$routeParams', '$http',
        function($scope, $resource, $routeParams, $http) {
            $scope.email = $routeParams.email;

            $scope.openMailSite = function() {
                var hash = {
                    'qq.com': 'http://mail.qq.com',
                    'gmail.com': 'http://mail.google.com',
                    'sina.com': 'http://mail.sina.com.cn',
                    '163.com': 'http://mail.163.com',
                    '126.com': 'http://mail.126.com',
                    'yeah.net': 'http://www.yeah.net/',
                    'sohu.com': 'http://mail.sohu.com/',
                    'tom.com': 'http://mail.tom.com/',
                    'sogou.com': 'http://mail.sogou.com/',
                    '139.com': 'http://mail.10086.cn/',
                    'hotmail.com': 'http://www.hotmail.com',
                    'live.com': 'http://login.live.com/',
                    'live.cn': 'http://login.live.cn/',
                    'live.com.cn': 'http://login.live.com.cn',
                    '189.com': 'http://webmail16.189.cn/webmail/',
                    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
                    'yahoo.cn': 'http://mail.cn.yahoo.com/',
                    'eyou.com': 'http://www.eyou.com/',
                    '21cn.com': 'http://mail.21cn.com/',
                    '188.com': 'http://www.188.com/',
                    'foxmail.coom': 'http://www.foxmail.com'
                };

                var _hash = $scope.email.split('@')[1];
                var website = hash[_hash];
                if (website) {
                    window.open(website);
                } else {
                    window.open('http://' + _hash);
                }
            };
        }
    ];
    index.controller('xhub.Index.InviteSuccess', index.InviteSuccess);

    index.Login = ['$scope', '$resource', '$routeParams', '$location',
        function($scope, $resource, $routeParams, $location) {
            ext.text('auth.invalid_email_or_password', '(⊙o⊙)，用户名密码错误了...');

            $scope.email = $routeParams.email || '';
            $scope.password = '';

            var actions = {
                login: {
                    method: 'POST',
                    responseType: 'json'
                }
            };

            var Login = $resource('/auth/login', {}, actions);

            $scope.login = function() {
                Login.login({
                    email: $scope.email,
                    password: $scope.password
                }, function(resp) {
                    if ($routeParams.next) {
                        window.location = $routeParams.next;
                    } else {
                        window.location = '/app';
                    }
                }, function(resp) {
                    // $scope.email = undefined;
                    $scope.password = undefined;
                });
            };
        }
    ];
    index.controller('xhub.Index.Login', index.Login);

    index.Forgot = ['$scope', '$resource', '$routeParams',
        function($scope, $resource, $routeParams) {
            $scope.email = $routeParams.email || '';

            $scope.resetPassword = function() {};

            $scope.isvalid = function() {
                return $scope.email && $scope.email.length >= 8;
            };
        }
    ];
    index.controller('xhub.Index.Forgot', index.Forgot);

    index.Register = ['$scope', '$resource', '$routeParams', '$location',
        function($scope, $resource, $routeParams, $location) {
            $scope.code = $routeParams.code;
            $scope.checking = false;
            $scope.valid = false;

            $scope.email = $routeParams.email;
            $scope.nickName = undefined;
            $scope.password = undefined;
            $scope.confirmPassword = undefined;

            var actions = {
                check: {
                    method: 'POST',
                    responseType: 'json'
                }
            };
            var Invite = $resource('/auth/invitecheck', {}, actions);

            var Register = $resource('/auth/register', {}, {
                register: {
                    method: 'POST',
                    responseType: 'json'
                }
            });

            $scope.register = function() {
                Register.register({
                    code: $scope.code,
                    email: $scope.email,
                    nickName: $scope.nickName,
                    password: $scope.password,
                    confirmPassword: $scope.confirmPassword
                }, function(resp) {
                    window.location = '/app';
                });
            };

            $scope.checking = true;
            Invite.check({
                code: $scope.code,
                email: $scope.email
            }, function(resp) {
                $scope.checking = false;
                $scope.valid = resp.result;
                $scope.email = resp.email;
            });
        }
    ];
    index.controller('xhub.Index.Register', index.Register);

    index.Index = [
        '$routeParams',
        '$location',
        function($routeParams, $location) {
            var code = $location.$$search.code;
            var next = $location.$$search.next;
            var email = $location.$$search.email;
            if (code) {
                $location.path('/register').search({
                    code: code
                });
            } else if (next) {
                $location.path('/login').search({
                    next: next
                });
            } else {
                $location.path("/checkingLogin");
            }
        }
    ];
    index.controller('xhub.Index.Index', index.Index);

    index.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/home', {
                controller: 'xhub.Index.Index'
            });

            $routeProvider.when('/checkingLogin', {
                templateUrl: 'checking_login.html',
                controller: 'xhub.Index.CheckingLogin'
            });

            $routeProvider.when('/invite', {
                templateUrl: 'invite.html',
                controller: 'xhub.Index.Invite'
            });

            $routeProvider.when('/invite/success', {
                templateUrl: 'invite_success.html',
                controller: 'xhub.Index.InviteSuccess'
            });

            $routeProvider.when('/login', {
                templateUrl: 'login.html',
                controller: 'xhub.Index.Login'
            });

            $routeProvider.when('/login/success', {
                templateUrl: 'login_success.html',
                controller: 'xhub.Index.CheckingLoginSuccess'
            });

            $routeProvider.when('/register', {
                templateUrl: 'register.html',
                controller: 'xhub.Index.Register'
            });

            $routeProvider.when('/forgot', {
                templateUrl: 'forgot.html',
                controller: 'xhub.Index.Forgot'
            });
        }
    ]);

    exports.startup = function() {
        angular.bootstrap(document.body, ['xhub.Index']);
    };
});
