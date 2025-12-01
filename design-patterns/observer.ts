interface Observer {
    update(data: any): void;
}

interface Subject {
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(data: any): void;
}

class NewsAgency implements Subject {
    private observers: Observer[] = [];
    private news: string = '';

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(data: any): void {
        this.observers.forEach(observer => observer.update(data));
    }

    setNews(news: string): void {
        this.news = news;
        this.notifyObservers(news);
    }
}

class NewsChannel implements Observer {
    constructor(private name: string) {}

    update(news: string): void {
        console.log(`${this.name} received news: ${news}`);
    }
}

// Usage
const agency = new NewsAgency();
const cnn = new NewsChannel('CNN');
const bbc = new NewsChannel('BBC');

agency.addObserver(cnn);
agency.addObserver(bbc);
agency.setNews('Breaking: TypeScript 5.0 released!');
cnn.update('Exclusive: How to train your dragon 2 released!');
agency.removeObserver(bbc);
agency.setNews('Update: New features in TypeScript 5.1!');