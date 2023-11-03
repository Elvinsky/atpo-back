import assert from "assert";
import validator from "../validator.js";
import testCases from "./validatorCases.js";

describe("validator module", () => {
  describe("throws error", () => {
    testCases.throw.forEach((testCase) => {
      it(testCase, () => {
        assert.throws(() => validator(testCase));
      });
    });
  });

  describe("does not throw error", () => {
    testCases.doesNotThrow.forEach((testCase) => {
      it(testCase, () => {
        assert.doesNotThrow(() => validator(testCase));
      });
    });
  });
});
