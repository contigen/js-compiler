`use strict`;

let visitor = {
  NumberLiteral: {
    enter(node, parent) {},
    exit(node, parent) {},
  },
  callExpression(node, parent) {},
};
// parsing, lexical analysis: the tokenizer
function tokenizer(input) {
  let travelCount = 0;
  let tokens = [];
  while (travelCount < input.length) {
    let currentChar = input[travelCount];
    if (currentChar === `(`) {
      tokens.push({
        type: `parenthesis`,
        value: `(`,
      });
      travelCount++;
      continue;
    }
    if (currentChar === `)`) {
      tokens.push({
        type: `parenthesis`,
        value: `)`,
      });
      travelCount++;
      continue;
    }
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(currentChar)) {
      travelCount++;
      continue;
    }
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(currentChar)) {
      let numbersValue = "";
      while (NUMBERS.test(currentChar)) {
        numbersValue += currentChar;
        // mind the prefix and postfix increment operator
        currentChar = input[++travelCount];
      }
      tokens.push({ type: `number`, value: numbersValue });
      continue;
    }
    // adding support for strings
    if (currentChar === '"') {
      let stringsValue = "";
      // skip opening double quote
      currentChar = input[++travelCount];

      while (currentChar != '"') {
        stringsValue += currentChar;
        currentChar = input[++travelCount];
      }
      //skip closing double quote
      currentChar = input[++travelCount];

      tokens.push({ type: `string`, value: stringsValue });
      continue;
    }
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(currentChar)) {
      let nameValue = "";
      while (LETTERS.test(currentChar)) {
        nameValue += currentChar;
        currentChar = input[++travelCount];
      }
      tokens.push({ type: `name`, value: nameValue });
      continue;
    }
    throw new Error(`invalid syntax: ${currentChar}`);
  }
  return tokens;
}
// turn our array of tokens to an Abstraction Syntax Tree - a collection of objects represented in a detailed format
function parser(tokens) {
  let travelCount = 0;
  function walk() {
    let token = tokens[travelCount];
    if (token.type === `number`) {
      travelCount++;
      return {
        type: `NumberLiteral`,
        value: token.value,
      };
    }
    if (token.type === `string`) {
      travelCount++;
      return {
        type: `StringLiteral`,
        value: token.value,
      };
    }
    if (token.type === `parenthesis` && token.value === `(`) {
      //skips opening parenthesis
      token = tokens[++travelCount];
      // create a base node and set the name to the stringValue
      let node = {
        type: `callExpression`,
        name: token.value,
        params: [],
      };
      // skip the name token, we already used the StringValue
      token = tokens[++travelCount];

      while (
        token.type !== `parenthesis` ||
        (token.type === `parenthesis` && token.value !== `)`)
      ) {
        // for nested calls,create a child node
        node.params.push(walk());
        token = tokens[++travelCount];
      }
      // skips closing parenthesis
      travelCount++;
      return node;
    }
    throw new TypeError(token.type);
  }
  // AST with a root node(token)
  let Ast = {
    type: `Program`,
    body: [],
  };
  // there might exist more than one callExpression, so loop through all
  while (travelCount < tokens.length) Ast.body.push(walk());
  return Ast;
}
// the traverser
function traverser(Ast, visitor) {
  function traverseArray(arr, parent) {
    arr.forEach((element) => {
      traverseNode(element, parent);
    });
  }
  function traverseNode(node, parent) {
    let methods = visitor[node.type];
    if (methods?.enter) {
      methods.enter(node, parent);
    }
    switch (node.type) {
      case `Program`:
        traverseArray(node.body, node);
        break;
      case `CallExpression`:
        traverseArray(node.params, node);
        break;
      case `NumberLiteral`:
      case `StringLiteral`:
        break;
      default:
        throw new TypeError(node.type);
    }
    if (methods?.exit) {
      methods.exit(node, parent);
    }
  }
  traverseNode(Ast, null);
}
