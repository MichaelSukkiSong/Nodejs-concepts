/*
class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
}


// we use module.exports when we want to export 1 single value.
// like a class declaration
module.exports = Calculator;
*/

// or we can do it like this. like a class expression. we say it's a class and sign it to a variable.

module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};
