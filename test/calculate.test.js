import assert from "assert";
import calculator from "../calculator.js";

describe("calculator module", () => {
  it("1+2 to equal 3", () => {
    const expression = "1+2";
    assert.equal(calculator(expression), 3);
  });
  it("1+2*5 to equal 11", () => {
    const expression = "1+2*5";
    assert.equal(calculator(expression), 11);
  });
  it("(1+4)*8 to equal 40", () => {
    const expression = "(1+4)*8";
    assert.equal(calculator(expression), 40);
  });
  it("11+34 to equal 45", () => {
    const expression = "11+34";
    assert.equal(calculator(expression), 45);
  });
  it("5/(2+3)-10*(6-3) to equal -29", () => {
    const expression = "5/(2+3)-10*(6-3)";
    assert.equal(calculator(expression), -29);
  });
});
