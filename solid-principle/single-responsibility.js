/**
 * Single Responsibility Principle
 *
 * A class should have only one reason to change, meaning it should have only one job or responsibility.
 */
// Violation of Single Responsibility Principle since User class has multiple responsibilities
// class User {
//   constructor(name, email) {
//     this.name = name;
//     this.email = email;
//   }

//   saveToDatabase() {
//     console.log(`Saving ${this.name} to database...`);
//   }

//   sendEmail() {
//     console.log(`Sending email to ${this.email}...`);
//   }
// }

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class UserRepository {
  save(user) {
    console.log(`Saving ${user.name} to database...`);
  }
}

class EmailService {
  sendEmail(user) {
    console.log(`Sending email to ${user.email}...`);
  }
}