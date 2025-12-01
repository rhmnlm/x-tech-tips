class Database {
    private static instance: Database;
    private constructor() {
        // Private constructor prevents direct instantiation
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public query(sql: string): void {
        console.log(`Executing: ${sql}`);
    }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true