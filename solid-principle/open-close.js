/**
 * Open/Closed Principle
 */
// Violation of Open/Closed Principle since Discount class needs to be modified for new discount types
// class Discount {
//   giveDiscount(type) {
//     if (type === "silver") return 10;
//     if (type === "gold") return 20;
//   }
// }

// Adheres to Open/Closed Principle
class Discount {
  getDiscount() {
    return 0;
  }
}

class SilverDiscount extends Discount {
  getDiscount() {
    return 10;
  }
}

class GoldDiscount extends Discount {
  getDiscount() {
    return 20;
  }
}