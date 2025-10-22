/**
 * Liskov Substitution Principle (LSP)
 */

// Violation of Liskov Substitution Principle since Penguin cannot substitute Bird

// class Bird {
//   fly() {
//     console.log("Flying");
//   }
// }

// class Penguin extends Bird {
//   fly() {
//     throw new Error("Penguins can’t fly!");
//   }
// }

// Adheres to Liskov Substitution Principle

class Bird {
  move() {
    console.log("Moving");
  }
}

class FlyingBird extends Bird {
  move() {
    console.log("Flying");
  }
}

class SwimmingBird extends Bird {
  move() {
    console.log("Swimming");
  }
}

class Sparrow extends FlyingBird {
  move() {
    console.log("Flying");
  }
}

class Penguin extends SwimmingBird {
  move() {
    console.log("Swimming");
  }
}