const GRADES = [
    { min: 90, max: 100, grade: "Outstanding", color: "hsl(152, 75%, 80%)" }, // Pastel mint
    { min: 80, max: 89, grade: "Excellent", color: "hsl(173, 80%, 74%)" },    // Pastel teal
    { min: 70, max: 79, grade: "Very Good", color: "hsl(190, 76%, 80%)" },    // Pastel sky blue
    { min: 60, max: 69, grade: "Good", color: "hsl(210, 79%, 80%)" },         // Pastel blue
    { min: 50, max: 59, grade: "Moderate", color: "hsl(230, 70%, 85%)" },     // Pastel periwinkle
    { min: 40, max: 49, grade: "Limited", color: "hsl(250, 65%, 85%)" },      // Pastel lavender
    { min: 20, max: 39, grade: "Low", color: "hsl(280, 60%, 85%)" },          // Pastel lilac
    { min: 1, max: 19, grade: "Very Low", color: "hsl(300, 70%, 85%)" },      // Pastel pink
    { min: 0, max: 0, grade: "Ungraded", color: "hsl(220, 15%, 80%)" }        // Pastel gray
];

angular.module('gradeApp', []).directive('sliderInput', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            element.on('input', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(element.val());
                    // Call the slider input function
                    scope.sliderInput();
                });
            });
        }
    };
}).controller('MainCtrl', [
    '$scope', '$timeout',
    function ($scope, $timeout) {
        // Initialize theme based on user preference
        $scope.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Default total value
        const DEFAULT_TOTAL = 100;

        // Legend visibility state
        $scope.showLegend = false;

        // Make grades available to the view for legend
        $scope.grades = GRADES;

        // Apply theme on load
        applyTheme($scope.isDarkMode);

        // Theme toggle function
        $scope.toggleTheme = function () {
            $scope.isDarkMode = !$scope.isDarkMode;
            applyTheme($scope.isDarkMode);
            localStorage.setItem('darkMode', $scope.isDarkMode);
        };

        // Toggle legend visibility
        $scope.toggleLegend = function () {
            $scope.showLegend = !$scope.showLegend;
            localStorage.setItem('showLegend', $scope.showLegend);
        };

        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        }

        function reset() {
            $scope.result = {
                percentage: null,
                color: null,
                animateChange: false
            };
            $scope.showResults = false;
        }

        reset();

        function loadSavedData() {
            // Load theme preference
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme !== null) {
                $scope.isDarkMode = savedTheme === 'true';
                applyTheme($scope.isDarkMode);
            }

            // Load legend preference
            const savedLegendState = localStorage.getItem('showLegend');
            if (savedLegendState !== null) {
                $scope.showLegend = savedLegendState === 'true';
            }

            // Load saved values
            const total = localStorage.getItem("total");
            if (total) {
                $scope.total = parseInt(total);
            } else {
                // Set default total if not saved
                $scope.total = DEFAULT_TOTAL;
                localStorage.setItem("total", DEFAULT_TOTAL);
            }

            const score = localStorage.getItem("score");
            if (score) {
                $scope.score = parseInt(score);
                // Calculate initial result if both values exist
                if ($scope.total) {
                    $scope.recalc(false);
                }
            }
        }

        loadSavedData();

        $scope.recalc = function (animate = true) {
            // Keep previous results visible
            const previousResults = $scope.result;

            reset();

            // Always show results section
            $scope.showResults = true;

            // Validate inputs
            if (!isValidInput($scope.score) || !isValidInput($scope.total)) {
                return;
            }

            // Ensure score doesn't exceed total
            if ($scope.score > $scope.total) {
                $scope.score = $scope.total;
            }

            // Calculate percentage
            const percentage = Math.ceil($scope.score / $scope.total * 100);
            $scope.result.percentage = percentage;

            // Find matching grade
            const matchedGrade = GRADES.find(el => el.min <= percentage && el.max >= percentage);
            if (matchedGrade) {
                $scope.result.grade = matchedGrade.grade;
                $scope.result.color = matchedGrade.color;

                // Add animation if requested
                if (animate) {
                    $scope.result.animateChange = true;
                    $timeout(function () {
                        $scope.result.animateChange = false;
                    }, 500);
                }
            }
        };

        // Initialize sliderValue
        $scope.sliderValue = 0;

        // Handle continuous slider input
        $scope.sliderInput = function () {
            // Calculate the result without animation
            $scope.recalc(false);
        };

        // On release, add the animation
        $scope.sliderReleased = function () {
            $scope.recalc(true);
        };

        // Watch for changes to save to localStorage
        $scope.$watch('total', function (newVal) {
            if (isValidInput(newVal)) {
                localStorage.setItem("total", parseInt(newVal));
                // Recalculate when total changes
                if ($scope.score !== undefined) {
                    $scope.recalc(false);
                }
            }
        });

        $scope.$watch('score', function (newVal) {
            if (isValidInput(newVal)) {
                localStorage.setItem("score", parseInt(newVal));
            }
        });

        function isValidInput(value) {
            return value !== undefined &&
                value !== null &&
                value !== '' &&
                !isNaN(value) &&
                parseInt(Number(value)) == value &&
                !isNaN(parseInt(value, 10)) &&
                value >= 0;
        }

        // Add this to your controller's initialization
        function setupSliderInputHandler() {
            // Get the slider element
            var slider = document.querySelector('input[type="range"]');
            if (slider) {
                // Add input event listener
                slider.addEventListener('input', function () {
                    $scope.$apply(function () {
                        // Update the score model
                        $scope.score = parseInt(slider.value);
                        // Calculate the result without animation
                        $scope.recalc(false);
                    });
                });
            }
        }

        // Call this after the DOM is ready
        angular.element(document).ready(function () {
            setupSliderInputHandler();
        });

        // Update the copyToClipboard function
        $scope.copyToClipboard = function () {
            // Get the descriptor text
            const descriptorText = $scope.result.grade;

            // Only proceed if we have a descriptor
            if (descriptorText) {
                // Create a temporary textarea element
                const textarea = document.createElement('textarea');
                textarea.value = descriptorText;
                document.body.appendChild(textarea);

                // Select and copy the text
                textarea.select();
                document.execCommand('copy');

                // Remove the temporary element
                document.body.removeChild(textarea);

                // Show feedback
                $scope.showCopyFeedback = true;

                // Hide feedback after 2 seconds
                $timeout(function () {
                    $scope.showCopyFeedback = false;
                }, 2000);
            }
        };
    }
]);