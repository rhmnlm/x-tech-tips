interface Coffee {
    cost(): number;
    description(): string;
}

class SimpleCoffee implements Coffee {
    cost(): number {
        return 2;
    }

    description(): string {
        return 'Simple coffee';
    }
}

abstract class CoffeeDecorator implements Coffee {
    constructor(protected coffee: Coffee) {}

    abstract cost(): number;
    abstract description(): string;
}

class MilkDecorator extends CoffeeDecorator {
    cost(): number {
        return this.coffee.cost() + 0.5;
    }

    description(): string {
        return this.coffee.description() + ', milk';
    }
}

class SugarDecorator extends CoffeeDecorator {
    cost(): number {
        return this.coffee.cost() + 0.25;
    }

    description(): string {
        return this.coffee.description() + ', sugar';
    }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()} costs $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()} costs $${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()} costs $${coffee.cost()}`);