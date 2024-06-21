# Learning Task Calculator

## Overview
The Learning Task Calculator is a simple Chrome extension that allows users to calculate grades based on scores entered. It uses AngularJS for its functionality and provides a user-friendly interface to input scores and view the corresponding grade and percentage.

## Features
- Calculate the grade and percentage based on the score and total possible score.
- Display the grade as "Outstanding", "Excellent", "Very Good", etc., based on the calculated percentage.

## Installation
1. Clone the repository to your local machine.
2. Navigate to the project directory and zip the contents.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable Developer Mode by toggling the switch at the top right.
5. Click on "Load unpacked" and select the zipped file of the project.
6. The extension should now be installed and ready to use.

## Usage
1. Click on the extension icon in Chrome's toolbar.
2. Enter the score and the total possible score in the popup.
3. The application will automatically calculate and display the grade and percentage.

## Customizing Grades
To modify the worded grades:
1. Open `main.js`
2. Locate and modify the [GRADES] to include your min, max and grade for each range.

Example of modifying grades:
```javascript
const GRADES = [
    { min: 90, max: 100, grade: "Exceptional" }, // Changed from "Outstanding"
    { min: 80, max: 89, grade: "Superior" },      // Changed from "Excellent"
    // Continue modifying other grades as needed
];
```

## Code Structure
- `manifest.json` Chrome extension metadata
- `popup.html` The main HTML file that includes the AngularJS application setup.
- `main.js` Contains the AngularJS controller logic for the application.
- `angular.min.js` The minified AngularJS library.

## Dependencies
- AngularJS 1.3.14
