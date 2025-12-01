var Dog = /** @class */ (function () {
    function Dog() {
    }
    Dog.prototype.makeSound = function () {
        console.log("Woof!");
    };
    return Dog;
}());
var Cat = /** @class */ (function () {
    function Cat() {
    }
    Cat.prototype.makeSound = function () {
        console.log("Meow!");
    };
    return Cat;
}());
var AnimalFactory = /** @class */ (function () {
    function AnimalFactory() {
    }
    AnimalFactory.createAnimal = function (type) {
        switch (type) {
            case 'dog':
                return new Dog();
            case 'cat':
                return new Cat();
            default:
                throw new Error('Unknown animal type');
        }
    };
    return AnimalFactory;
}());
// Usage
var dog = AnimalFactory.createAnimal('dog');
var cat = AnimalFactory.createAnimal('cat');
dog.makeSound(); // Woof!
cat.makeSound(); // Meow!
