(function (globalScope) {
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

    function getGradeForPercentage(percentage) {
        const value = Number(percentage);
        if (!Number.isFinite(value) || value < 0) {
            return { grade: null, gradeIndex: -1 };
        }

        const gradeBand = Math.floor(value);

        for (let i = 0; i < GRADES.length; i++) {
            const grade = GRADES[i];
            if (gradeBand >= grade.min && gradeBand <= grade.max) {
                return { grade: grade.grade, gradeIndex: i };
            }
        }

        return { grade: null, gradeIndex: -1 };
    }

    const api = {
        GRADES: GRADES,
        getGradeForPercentage: getGradeForPercentage
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    } else {
        globalScope.GradeUtils = api;
    }
})(typeof globalThis !== "undefined" ? globalThis : this);
