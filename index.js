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

      tokens.push({ type: `strings`, value: stringsValue });
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
    throw new Error(`invalid syntax: currentChar`);
  }
  return tokens;
}
function parser(tokens) {}
