class Game {

    constructor() {
        this.capital = 0;
        this.hour = 0;
        this.day = 0;
        this.age = 18;

        this.views = [];
    }

    mainLoop() {
        // UPDATE
        this.capital++;

        if (this.hour < 23) {
            this.hour++;
        }
        else {
            this.hour = 0;
            this.day++;
        }

        const isLeapYear = (this.age % 4) == 0;

        if ((isLeapYear && this.day > 365) || (!isLeapYear && this.day > 364)) {
            this.day = 0;
            this.age++;
        }

        // RENDER
        this.views.forEach(view => view.update());
    }

    run() {
        this.initViews();

        setInterval(() => this.mainLoop(), 1000);
    }

    initViews() {
        const parentElement = document.body;

        this.buildNumericView("capital", "Capital ($)", parentElement, () => this.capital);
        this.buildNumericView("hour", "Hour", parentElement, () => this.hour);
        this.buildNumericView("day", "Day", parentElement, () => this.day);
        this.buildNumericView("age", "Age", parentElement, () => this.age);
    }

    buildNumericView(name, label, parentElement, updater) {
        const view = new NumericView(name, label, parentElement, updater);
        view.create();
        this.views.push(view);
    }
}

window.onload = () => {
    const game = new Game();

    // Put in global scope for debug purposes
    // TODO: Figure out if there is a better way to achieve this
    window.game = game;

    game.run()
}
