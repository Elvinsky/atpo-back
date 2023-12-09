import calculator from "../calculator.js";

const possibleDeclarations = ["let", "const"];

export function replaceVariables(code) {
  let variables = {};

  let lines = code.split("\n");

  for (let line of lines) {
    line = line.trim();

    if (possibleDeclarations.some((declaration) => line.startsWith(declaration))) {
      const [declaration, expression] = line.split(/(?<=^\S+)\s/);

      if (!expression) {
        throw new ReferenceError(`${declaration} is not defined.`);
      }

      const splittedExpression = expression.split(',');

      for (let i = 0; i < splittedExpression.length; i++) {
        const expressionVariables = parseVariableExpression(splittedExpression[i].trim(), declaration, variables);

        variables = {
          ...variables,
          ...expressionVariables,
        }
      }
    } else if (line.indexOf('=') > -1) {
      const [name, sign, value] = line.split(" ");
      
      if (!possibleDeclarations.includes(name) && !variables.hasOwnProperty(name)) {
        throw new SyntaxError(`Unexpected variable declaration '${name}'.`);
      }
      
      if (!variables.hasOwnProperty(name)) {
        throw new ReferenceError(`Variable ${name} is not defined.`);
      }

      if (sign !== '=') {
        throw new SyntaxError(`Unexpected token '${sign}'.`);
      }

      if (variables[name].declaration === "const") {
        throw new TypeError(`Assignment to constant variable ${name}.`);
      } else {
        variables[name].value = value;
      }
    } else {
      for (let name in variables) {
        const value = variables[name].value;

        const regex = new RegExp(`\\b${name}\\b`, "g");

        line = line.replace(regex, value);
      }

      return line;
    }
  }
}

const parseVariableExpression = (expression, declaration, variables) => {
  const expressionVariables = {};

  let [variable, value] = expression.trim().split(/(?<!=)=(?!=)/g);

  variable = variable.trim();

  if (value) {
    const expressionRegex = new RegExp(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^=]+$/g);
  
    if (!expressionRegex.test(expression)) {
      throw new SyntaxError(`Invalid variable assignment syntax: ${expression}`);
    }
  }

  const variableRegex = new RegExp(/^([a-zA-Z_$][a-zA-Z\d_$]*)$/g);

  if (value && !variableRegex.test(variable)) {
    throw new SyntaxError(`Invalid variable name: ${variable}.`);
  }

  if (declaration === 'const') {
    if (!value) {
      throw new SyntaxError('Missing initializer in const declaration');
    }

    if (variables.hasOwnProperty(variable)) {
      throw new TypeError(`Assignment to constant variable ${variable}.`);
    }

    expressionVariables[variable] = { declaration, value: calculator(value.trim()) };
  } else {
    if (!value) {
      expressionVariables[variable] = { declaration, value: undefined };

      return expressionVariables;
    }

    if (variables.hasOwnProperty(variable)) {
      throw new SyntaxError(`Identifier '${variable}' has already been declared.`);
    }

    expressionVariables[variable] = { declaration, value: calculator(value.trim()) };
  }

  return expressionVariables;
}
