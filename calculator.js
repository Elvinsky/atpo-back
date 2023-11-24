import validator from "./validator.js";

const operationsPriority = {
  ";": 0,
  "+": 1,
  "-": 1.5,
  "*": 2,
  "/": 2,
  "(": 3,
};

function calculator(expression) {
  validator(expression);

  if (!expression.endsWith(";")) {
    expression = `${expression};`;
  }
  const operandStack = [];
  const operationStack = [];
  for (let i = 0; i < expression.length; i++) {
    const value = expression[i];

    if (value === " ") continue;

    const [number, newIndex, isUnary] = parseNumber(expression, i);

    if (isUnary) {
      operandStack.push(number);
      operationStack.push("*");
      continue;
    }

    if (!Number.isNaN(Number(number))) {
      operandStack.push(Number(number));
      i = newIndex;
    } else {
      if (value === ")") {
        let operation, operand1, operand2;
        while (
          (operation = operationStack.pop()) !== "(" &&
          (operand1 = operandStack.pop()) &&
          (operand2 = operandStack.pop())
        ) {
          const res = execOperation(operation, operand2, operand1);

          operandStack.push(res);
        }
      } else if (value === "(") {
        operationStack.push(value);
      } else {
        while (
          operandStack.length >= 2 &&
          operationStack.length &&
          operationStack.at(-1) !== "(" &&
          operationsPriority[value] < operationsPriority[operationStack.at(-1)]
        ) {
          let operation = operationStack.pop();
          let operand1 = operandStack.pop();
          let operand2 = operandStack.pop();

          const res = execOperation(operation, operand2, operand1);

          operandStack.push(res);
        }

        operationStack.push(value);
      }
    }
  }

  return operandStack[0];
}

function parseNumber(expression, index) {
  let value = expression[index];
  if (!Number.isNaN(Number(value))) {
    let i = index;
    let count = 1;
    let number = Number(value);
    while (
      !Number.isNaN(Number(expression[i + 1])) &&
      expression[i + 1] !== " "
    ) {
      count *= 10;
      i++;
      number = number * count + Number(expression[i]);
    }
    return [number, i];
  }

  if (
    (value === "-" || value === "+") &&
    ((index === 0 && !Number.isNaN(expression[index + 1])) ||
      (expression[index - 1] === "(" && expression[index + 1] === "(") ||
      (expression[index - 1] === "(" &&
        !Number.isNaN(Number(expression[index + 1]))))
  ) {
    const sign = value === "-" ? -1 : 1;
    return [sign, index, true];
  }

  return [Number.NaN, index];
}

function execOperation(operation, operand1, operand2) {
  let res;
  switch (operation) {
    case "+": {
      res = operand1 + operand2;
      break;
    }
    case "*": {
      res = operand1 * operand2;
      break;
    }
    case "-": {
      res = operand1 - operand2;
      break;
    }
    case "/": {
      res = operand1 / operand2;
      break;
    }
  }

  return res;
}

export default calculator;
