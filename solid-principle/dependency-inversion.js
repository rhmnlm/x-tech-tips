class Database {
  save(data) {}
}

class MySQLDatabase extends Database {
  save(data) {
    console.log("Saving data to MySQL...");
  }
}

class MongoDB extends Database {
  save(data) {
    console.log("Saving data to MongoDB...");
  }
}

class UserService {
  constructor(database) {
    this.database = database; // depends on abstraction
  }

  saveUser(user) {
    this.database.save(user);
  }
}

// Usage:
const db = new MongoDB();
const userService = new UserService(db);
userService.saveUser({ name: "Alice" });
