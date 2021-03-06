"use strict";

appServices.factory("UserAgentSvc", ['$http', '$q', function ($http, $q) {
    var service = {};

    var av = navigator.appVersion;//window.navigator 对象包含有关访问者浏览器的信息。
    var ua = navigator.userAgent;

    var getPlatform = function () {//获取手机平台
        if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
            return "iPhone"
        }
        return "Android"
    };

    var checkWx = function () {//检查是否微信
        var a = av.toLowerCase();
        if (a.match(/MicroMessenger/i) == "micromessenger") {
            return true
        } else {
            return false
        }
    };

    service.isWx = checkWx();
    service.platform_os = getPlatform();

    return service;
}]);