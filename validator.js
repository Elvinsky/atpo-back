const allowedSymbols = "+-*/();";
const allowedRepeat = "()";

const exprCycle = ["expression", "operation", "expression"];

function validator(expression, isExpr = false, pos = 0) {
  if (expression.endsWith(";")) {
    expression = expression.slice(0, expression.length - 1);
  }

  let symbols = [];

  for (let i = pos; i < expression.length; i++) {
    let value = expression[i];

    if (value === " ") continue;

    const [number, newIndex] = parseNumber(expression, i);

    if (number === "-" || number === "+") continue;

    if (!Number.isNaN(Number(number))) {
      symbols.push({
        value: number.toString(),
        posStart: i,
        posEnd: newIndex,
        type: "expression",
      });

      i = newIndex;
    } else {
      if (allowedSymbols.includes(value)) {
        let newPos = i;
        let newSymbols = [];

        if (value === "(") {
          [newPos, newSymbols] = validator(expression, true, i + 1);

          if (newSymbols.length === 0) {
            throw new Error("Parenthesis cannot be empty");
          }

          symbols.push({
            value: newSymbols,
            posStart: i,
            posEnd: newPos,
            type: "expression",
          });

          i = newPos;
        } else if (value === ")") {
          if (!isExpr) {
            throw new Error(
              "Closed parenthesis doesn't have opened corresponding one"
            );
          }

          // if (symbols.at(-1).type == "operation") {
          //   throw new Error("operation dont have second operand");
          // }

          if (
            symbols.length % 3 !== 0 &&
            !(symbols.length === 1 && symbols[0].type === "expression")
          ) {
            throw new Error("Expression in parenthesis are not valid");
          }

          return [i, symbols];
        } else {
          symbols.push({
            value: value,
            posStart: i,
            posEnd: i,
            type: "operation",
          });
        }
      } else {
        throw new Error(`Invalid character in expression ${expression[i]}`);
      }
    }

    if (
      symbols.at(-1) &&
      exprCycle[(symbols.length - 1) % (exprCycle.length - 1)] !==
        symbols.at(-1).type
    ) {
      throw new Error(
        `Error at expression's cycle. Unexpected ${symbols.at(-1).value}`
      );
    }

    if (symbols.length === 3) {
      let prevValues = symbols.slice();

      symbols = [];
      symbols.push({
        value: prevValues,
        type: "expression",
      });
    }
  }

  if (isExpr) {
    throw new Error("Opened parenthesis doesn't have closed corresponding one");
  }

  if (symbols.length !== 1 || symbols.at(-1).type !== "expression") {
    throw new Error("After operation there should be expression");
  }

  return [expression.length - 1, symbols];
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
    return [value, index];
  }

  return [Number.NaN, index];
}

export default validator;
