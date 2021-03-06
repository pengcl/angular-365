'use strict';

app.directive("timer", ['$interval', function ($interval) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "component_modules/timer/timer.html",
        link: function (scope, element, attrs) {

            var d = new Date();
            var endTime = (new Date(d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + "23:59:00")).getTime();

            if (attrs.endTime) {
                endTime = attrs.endTime;
            }

            function getRTime() {

                var EndTime = endTime;
                var NowTime = (new Date()).getTime();


                var t = EndTime - NowTime;

                var d = Math.floor(t / 1000 / 60 / 60 / 24);
                var h = Math.floor(t / 1000 / 60 / 60 % 24);
                if (h < 10) {
                    h = "0" + h;
                }
                var m = Math.floor(t / 1000 / 60 % 60);
                if (m < 10) {
                    m = "0" + m;
                }
                var s = Math.floor(t / 1000 % 60);
                if (s < 10) {
                    s = "0" + s;
                }
                if(d > 0){
                    scope.timer = "<i>" + d + "</i>" + "<sub>天</sub>" + "<i>" + h + "</i>" + "<sub>时</sub>" + "<i>" + m + "</i>" + "<sub>分</sub>" + "<i>" + s + "</i>" + "<sub>秒</sub>";
                }else {
                    scope.timer = "<i>" + h + "</i>" + "<sub>时</sub>" + "<i>" + m + "</i>" + "<sub>分</sub>" + "<i>" + s + "</i>" + "<sub>秒</sub>";
                }
                //scope.timer = "1";
                //console.log(scope.timer);
            };

            $interval(getRTime, 1000);
        }
    };
}]);