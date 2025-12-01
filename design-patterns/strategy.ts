interface PaymentStrategy {
    pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
    constructor(private cardNumber: string) {}

    pay(amount: number): void {
        console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
    }
}

class PayPalPayment implements PaymentStrategy {
    constructor(private email: string) {}

    pay(amount: number): void {
        console.log(`Paid $${amount} using PayPal account ${this.email}`);
    }
}

class ShoppingCart {
    private paymentStrategy!: PaymentStrategy;

    setPaymentStrategy(strategy: PaymentStrategy): void {
        this.paymentStrategy = strategy;
    }

    checkout(amount: number): void {
        if (!this.paymentStrategy) {
            throw new Error('Payment strategy not set');
        }
        this.paymentStrategy.pay(amount);
    }
}

// Usage
const cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardPayment('1234567890123456'));
cart.checkout(100);

cart.setPaymentStrategy(new PayPalPayment('user@example.com'));
cart.checkout(50);