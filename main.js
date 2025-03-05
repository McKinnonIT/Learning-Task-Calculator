const GRADES = [
    { min: 90, max: 100, grade: "Outstanding", color: "var(--mint)" },
    { min: 80, max: 89, grade: "Excellent", color: "var(--teal)" },
    { min: 70, max: 79, grade: "Very Good", color: "var(--sky-blue)" },
    { min: 60, max: 69, grade: "Good", color: "var(--blue)" },
    { min: 50, max: 59, grade: "Moderate", color: "var(--periwinkle)" },
    { min: 40, max: 49, grade: "Limited", color: "var(--lavender)" },
    { min: 20, max: 39, grade: "Low", color: "var(--lilac)" },
    { min: 1, max: 19, grade: "Very Low", color: "var(--pink)" },
    { min: 0, max: 0, grade: "Ungraded", color: "var(--gray)" }
];

angular.module('gradeApp', []).directive('sliderInput', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            // Parse view value to model value
            ngModel.$parsers.push(function (value) {
                return parseFloat(value) || 0;
            });

            // Format model value to view value
            ngModel.$formatters.push(function (value) {
                return parseFloat(value) || 0;
            });

            // Listen for input event (fires continuously while sliding)
            element.on('input', function () {
                scope.$apply(function () {
                    // Round to integer for slider
                    const intValue = Math.round(parseFloat(element.val()) || 0);
                    ngModel.$setViewValue(intValue);

                    // Update the score in real-time
                    scope.score = intValue;

                    // Call the slider input function to recalculate
                    scope.sliderInput();
                });
            });
        }
    };
}).controller('MainCtrl', [
    '$scope', '$timeout',
    function ($scope, $timeout) {
        // Initialize theme based on user preference or saved preference
        const savedDarkMode = localStorage.getItem('darkMode');
        $scope.isDarkMode = savedDarkMode !== null
            ? savedDarkMode === 'true'
            : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Default total value
        const DEFAULT_TOTAL = 100;

        // Legend visibility state
        $scope.showLegend = false;

        // Make grades available to the view for legend
        $scope.grades = GRADES;

        // Animation states
        $scope.animatePercentage = false;
        $scope.animateGrade = false;
        $scope.showCopyFeedback = false;

        // Apply theme on load
        applyTheme($scope.isDarkMode);

        // Theme toggle function
        $scope.toggleTheme = function () {
            $scope.isDarkMode = !$scope.isDarkMode;
            applyTheme($scope.isDarkMode);
            localStorage.setItem('darkMode', $scope.isDarkMode);
        };

        // Legend toggle function
        $scope.toggleLegend = function () {
            $scope.showLegend = !$scope.showLegend;
            localStorage.setItem('showLegend', $scope.showLegend);
        };

        // Apply theme to document
        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        }

        // Reset function
        function reset() {
            $scope.score = '';
            $scope.total = DEFAULT_TOTAL;
            $scope.percentage = 0;
            $scope.grade = '';
            $scope.gradeIndex = -1;
        }

        // Initialize
        reset();
        loadSavedData();

        // Load saved data from localStorage
        function loadSavedData() {
            try {
                const savedData = JSON.parse(localStorage.getItem('calculatorData'));
                if (savedData) {
                    $scope.score = savedData.score !== undefined && savedData.score !== null ? parseFloat(savedData.score) : '';
                    $scope.total = savedData.total !== undefined && savedData.total !== null ? parseFloat(savedData.total) : DEFAULT_TOTAL;

                    // Recalculate with loaded data
                    if ($scope.score !== '' && $scope.total) {
                        recalculate();
                    }
                }

                // Load legend preference
                const savedLegend = localStorage.getItem('showLegend');
                if (savedLegend !== null) {
                    $scope.showLegend = savedLegend === 'true';
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
                reset();
            }
        }

        // Save current data to localStorage
        function saveData() {
            try {
                const dataToSave = {
                    score: $scope.score,
                    total: $scope.total
                };
                localStorage.setItem('calculatorData', JSON.stringify(dataToSave));
            } catch (e) {
                console.error('Error saving data:', e);
            }
        }

        // Recalculate function - exposed to the scope
        $scope.recalculate = function () {
            recalculate();
        };

        // Recalculate function
        function recalculate() {
            if (!isValidInput($scope.score) || !isValidInput($scope.total)) {
                return;
            }

            const score = parseFloat($scope.score);
            const total = parseFloat($scope.total);

            if (isNaN(score) || isNaN(total) || total <= 0) {
                return;
            }

            // Calculate percentage
            const oldPercentage = $scope.percentage;
            $scope.percentage = (score / total) * 100;

            // Find grade descriptor
            let foundGrade = null;
            let foundIndex = -1;

            for (let i = 0; i < GRADES.length; i++) {
                const grade = GRADES[i];
                if ($scope.percentage >= grade.min && $scope.percentage <= grade.max) {
                    foundGrade = grade.grade;
                    foundIndex = i;
                    break;
                }
            }

            const oldGrade = $scope.grade;
            $scope.grade = foundGrade;
            $scope.gradeIndex = foundIndex;

            // Animate changes if values have changed
            if (oldPercentage !== $scope.percentage) {
                $scope.animatePercentage = true;
                $timeout(function () {
                    $scope.animatePercentage = false;
                }, 500);
            }

            if (oldGrade !== $scope.grade) {
                $scope.animateGrade = true;
                $timeout(function () {
                    $scope.animateGrade = false;
                }, 500);
            }

            // Update slider background
            updateSliderBackground();

            // Save data
            saveData();
        }

        // Update the slider background to show progress
        function updateSliderBackground() {
            const slider = document.querySelector('.slider');
            if (!slider) return;

            const value = parseFloat($scope.score) || 0;
            const max = parseFloat($scope.total) || 100;
            const percentage = (value / max) * 100;

            slider.style.background = `linear-gradient(to right, 
                hsl(var(--primary)) 0%, 
                hsl(var(--primary)) ${percentage}%, 
                hsl(var(--muted)) ${percentage}%, 
                hsl(var(--muted)) 100%)`;
        }

        // Validate input
        function isValidInput(value) {
            if (value === undefined || value === null || value === '') {
                return false;
            }

            // Handle string values by parsing them
            if (typeof value === 'string') {
                value = value.trim();
                if (value === '') return false;
            }

            const num = parseFloat(value);
            return !isNaN(num) && isFinite(num) && num >= 0;
        }

        // Handle slider input
        $scope.sliderInput = function () {
            recalculate();
        };

        // Copy to clipboard function
        $scope.copyToClipboard = function (value, type) {
            if (!value) return;

            let textToCopy = '';

            if (type === 'percentage') {
                textToCopy = value.toFixed(2) + '%';
            } else if (type === 'grade') {
                textToCopy = $scope.grade;
            }

            navigator.clipboard.writeText(textToCopy).then(function () {
                $scope.$apply(function () {
                    $scope.showCopyFeedback = true;
                    $timeout(function () {
                        $scope.showCopyFeedback = false;
                    }, 2000);
                });
            }).catch(function (err) {
                console.error('Could not copy text: ', err);
            });
        };

        // Get color class for grade index
        $scope.getColorClass = function (index) {
            if (index < 0) return '';

            // Use the color directly from the GRADES array instead of hardcoded color classes
            // This ensures that if GRADES colors change, the display will be consistent
            return { 'color': GRADES[index].color };
        };

        // Expose recalculate function to the scope
        $scope.recalc = function () {
            recalculate();
        };

        // Listen for media query changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', function (e) {
            if (localStorage.getItem('darkMode') === null) {
                $scope.$apply(function () {
                    $scope.isDarkMode = e.matches;
                    applyTheme($scope.isDarkMode);
                });
            }
        });

        // Initialize slider background
        $timeout(function () {
            updateSliderBackground();
        }, 0);
    }
]);