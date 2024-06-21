const GRADES = [
    { min: 90, max: 100, grade: "Outstanding" },
    { min: 80, max: 89, grade: "Excellent" },
    { min: 70, max: 79, grade: "Very Good" },
    { min: 60, max: 69, grade: "Good" },
    { min: 50, max: 59, grade: "Moderate" },
    { min: 40, max: 49, grade: "Limited" },
    { min: 20, max: 39, grade: "Low" },
    { min: 1, max: 19, grade: "Very Low" },
    { min: 0, max: 0, grade: "Ungraded" }
];

angular.module('gradeApp', []).controller('MainCtrl', [
    '$scope',
    function ($scope) {
        function reset() {
            $scope.result = {
                percentage: null
            };
        }
        reset();
        function load() {
            var total = window.localStorage.getItem("total");
            if (total) {
                $scope.total = parseInt(total);
            }
        }
        load();
        $scope.recalc = function () {
            reset();
            if (!$scope.score || $scope.score == 0) {
                return;
            }
            if (!$scope.total || $scope.total == 0) {
                return;
            }
            var p = Math.ceil($scope.score / $scope.total * 100);
            $scope.result.percentage = p;
            GRADES.forEach(function (el) {
                if (el.min <= p && el.max >= p) {
                    $scope.result.grade = el.grade;
                }
            });
        };
        $scope.$watch('total', function (newVal) {
            if (newVal && isInt(newVal)) {
                window.localStorage.setItem("total", parseInt(newVal));
            }
        });

        function isInt(value) {
            return !isNaN(value) &&
                parseInt(Number(value)) == value &&
                !isNaN(parseInt(value, 10));
        }
    }
]);