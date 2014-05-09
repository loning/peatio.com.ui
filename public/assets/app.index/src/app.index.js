define(function(require, exports, module) {

    'use strict';

    var angular = require('angularjs');
    require('angularjs-resource');

    var app = require('app'),ext = require('ext'),notice = require('./notice.js');
    var index = angular.module('app.Index', ['ngResource','app','notice']);

    // TODO
    index.controller('app.Index.Index',function(){});

    exports.startup = function() {
        angular.bootstrap(document.body, ['app.Index']);
    };
});
