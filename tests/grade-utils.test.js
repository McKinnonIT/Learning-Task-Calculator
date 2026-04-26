const test = require("node:test");
const assert = require("node:assert/strict");
const { getGradeForPercentage } = require("../grade-utils");

test("maps decimal percentage gaps to expected grades", () => {
    assert.equal(getGradeForPercentage(59.375).grade, "Moderate"); // 19/32
    assert.equal(getGradeForPercentage(79.41176470588235).grade, "Very Good"); // 27/34
});

test("maps each grade boundary correctly", () => {
    assert.equal(getGradeForPercentage(0).grade, "Ungraded");
    assert.equal(getGradeForPercentage(1).grade, "Very Low");
    assert.equal(getGradeForPercentage(19.999).grade, "Very Low");
    assert.equal(getGradeForPercentage(20).grade, "Low");
    assert.equal(getGradeForPercentage(39.999).grade, "Low");
    assert.equal(getGradeForPercentage(40).grade, "Limited");
    assert.equal(getGradeForPercentage(49.999).grade, "Limited");
    assert.equal(getGradeForPercentage(50).grade, "Moderate");
    assert.equal(getGradeForPercentage(59.999).grade, "Moderate");
    assert.equal(getGradeForPercentage(60).grade, "Good");
    assert.equal(getGradeForPercentage(69.999).grade, "Good");
    assert.equal(getGradeForPercentage(70).grade, "Very Good");
    assert.equal(getGradeForPercentage(79.999).grade, "Very Good");
    assert.equal(getGradeForPercentage(80).grade, "Excellent");
    assert.equal(getGradeForPercentage(89.999).grade, "Excellent");
    assert.equal(getGradeForPercentage(90).grade, "Outstanding");
    assert.equal(getGradeForPercentage(100).grade, "Outstanding");
});

test("returns no grade for unsupported values", () => {
    assert.equal(getGradeForPercentage(-1).grade, null);
    assert.equal(getGradeForPercentage(101).grade, null);
    assert.equal(getGradeForPercentage(Number.NaN).grade, null);
    assert.equal(getGradeForPercentage(Infinity).grade, null);
});
