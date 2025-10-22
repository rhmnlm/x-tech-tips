class Workable {
  work() {}
}

class Eatable {
  eat() {}
}

class Human extends Workable {
  eat() {
    console.log("Eating...");
  }
}

class Robot extends Workable {
  // No eat() needed
}