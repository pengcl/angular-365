"use strict";

app.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {

    // 设定路由
    $stateProvider
        .state('follow', { //关于我们
            url: "/activity/follow",
            templateUrl: "views/activity/follow/follow.html",
            controller: "followController"
        });
}]).controller('followController', ['$scope', '$http', '$timeout', '$interval', 'ActiveCodeSvc', 'AuthenticationSvc', 'ShareSvc', 'UserSvc', function ($scope, $http, $timeout, $interval, ActiveCodeSvc, AuthenticationSvc, ShareSvc, UserSvc) {

    var count = 0;
    var index = 0;
    var prizeNum = 3;

    $http.get(apiConfig.apiHost + "/activity/getTurntableProduct.ht").success(function (data, status, headers, config) {
        $scope.roulettes = angular.fromJson(data);

        var getItem = function () {
            return "恭喜" + getRandomReceiverPhone() + "用户，获得了" + getRandomProduct($scope.roulettes);
        };

        $scope.luckyPeoples = getItem();
        $interval(function () {
            $scope.luckyPeoples = getItem();
        }, 2000);
    }).error(function (error) {
        console.log(error);
    });

    ShareSvc.wxShare({
        title: '关注有礼，流量送不停！',
        desc: '关注有礼，流量送不停，邀请好友一起来摇奖吧！',
        link: 'http://app.ljker.com/activity/follow',
        imgUrl: 'http://app.ljker.com/views/activity/follow/shareImg.jpg'
    });

    $scope.award = {
        overlay: false
    };

    function rouletteAni(index) {
        $(".roulette-item-box").removeClass("curr");
        $("#roulette-" + index).addClass("curr");
    }

    function rouletteEnd() {
        if (index <= prizeNum) {
            rouletteAni(index);
            index = index + 1;
        } else {
            $timeout(function () {
                $scope.award.overlay = true;
            }, 500);
            count = 0;
            return false;
        }
        $timeout(function () {
            rouletteEnd();
        }, 200);
    }

    function rouletteStart() {
        if (index <= 7) {
            rouletteAni(index);
            index = index + 1;
        } else if (index == 8 && count < 5) {
            index = 0;
            rouletteAni(index);
            count = count + 1;
        } else {
            index = 0;
            rouletteEnd();
            return false;
        }
        $timeout(function () {
            rouletteStart();
        }, 60);
    }

    $scope.start = function () {//开始抽奖
        if ($scope.userInfo.turntableNum > 0) {
            $http.get(apiConfig.apiHost + "/activity/lottery.ht?customerId=" + $scope.userInfo.memberId).success(function (data, status, headers, config) {//获取抽中物品记录
                $scope.lottery = angular.fromJson(data)[0];
                if ($scope.lottery.code === "1") {
                    $scope.dialog.open(true, "系统提示", $scope.prize.msg, [{show: true, txt: '我知道了', eventId: 'hello'}]);
                } else {
                    $scope.userInfo.turntableNum = $scope.userInfo.turntableNum - 1;
                    prizeNum = $scope.lottery.result.id - 1;
                    $scope.prize = $scope.roulettes[prizeNum];
                    rouletteStart();
                }

            }).error(function (error) {
                console.log(error);
            });
        } else {
            $scope.dialog.open({
                show: true,
                title: "系统提示",
                body: '您的抽奖次数为零，不能再抽奖了！',
                buttons: [{show: true, txt: '我知道了', eventId: 'hello'}]
            });
        }
    };

    UserSvc.getUserInfoByOpenid($scope.openid).then(function success(data) {//获取用户信息
        $scope.userInfo = data;

    });

    $scope.getPrize = function (url) {
        if (url) {
            window.location.href = url;
        }
    };

    $scope.cancel = function () {
        $scope.award.overlay = false;
    };
    $scope.continue = function () {
        $scope.award.overlay = false;
        $scope.start();
    };
    $scope.success = function (url) {
        $scope.award.overlay = false;
        $scope.getPrize(url);
    };

    //登录
    $scope.activeText = "获取验证码";
    $scope.activeClass = true;

    //输入验证码

    var second = 59, timePromise = undefined;
    $scope.getActiveCode = function (e, mobile) {
        if ($(e.currentTarget).hasClass("disabled")) {
            return false;
        }
        //$scope.loadingToast.open(true);
        ActiveCodeSvc.getActiveCode(mobile).then(function success(data) {
            $scope.activeClass = false;
            //$scope.loadingToast.open(false);
            timePromise = $interval(function () {
                if (second <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = undefined;

                    second = 59;
                    $scope.activeText = "重发验证码";
                    $scope.activeClass = true;
                } else {
                    $scope.activeText = second + "秒后可重发";
                    $scope.activeClass = false;
                    second--;

                }
            }, 1000, 100);
        });
    };
}]);