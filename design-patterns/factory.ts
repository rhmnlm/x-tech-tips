type animalType = 'dog' | 'cat';

interface Animal {
    makeSound(): void;
}

class Dog implements Animal {
    makeSound(): void {
        console.log("Woof!");
    }
}

class Cat implements Animal {
    makeSound(): void {
        console.log("Meow!");
    }
}

class AnimalFactory {
    static createAnimal(type: animalType): Animal {
        switch (type) {
            case 'dog':
                return new Dog();
            case 'cat':
                return new Cat();
            default:
                throw new Error('Unknown animal type');
        }
    }
}

// Usage
const dog = AnimalFactory.createAnimal('dog');
const cat = AnimalFactory.createAnimal('cat');
dog.makeSound(); // Woof!
cat.makeSound(); // Meow!