var NewsAgency = /** @class */ (function () {
    function NewsAgency() {
        this.observers = [];
        this.news = '';
    }
    NewsAgency.prototype.addObserver = function (observer) {
        this.observers.push(observer);
    };
    NewsAgency.prototype.removeObserver = function (observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    };
    NewsAgency.prototype.notifyObservers = function (data) {
        this.observers.forEach(function (observer) { return observer.update(data); });
    };
    NewsAgency.prototype.setNews = function (news) {
        this.news = news;
        this.notifyObservers(news);
    };
    return NewsAgency;
}());
var NewsChannel = /** @class */ (function () {
    function NewsChannel(name) {
        this.name = name;
    }
    NewsChannel.prototype.update = function (news) {
        console.log("".concat(this.name, " received news: ").concat(news));
    };
    return NewsChannel;
}());
// Usage
var agency = new NewsAgency();
var cnn = new NewsChannel('CNN');
var bbc = new NewsChannel('BBC');
agency.addObserver(cnn);
agency.addObserver(bbc);
agency.setNews('Breaking: TypeScript 5.0 released!');
cnn.update('Exclusive: How to train your dragon 2 released!');
agency.removeObserver(bbc);
agency.setNews('Update: New features in TypeScript 5.1!');
