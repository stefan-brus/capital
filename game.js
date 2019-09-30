class Game {

    // --- INIT LOGIC ---

    constructor() {
        this.state = {};
        this.state.capital = 0;
        this.state.hour = 0;
        this.state.day = 0;
        this.state.age = 18;

        this.views = [];
    }

    initViews() {
        const parentElement = document.body;

        this.buildNumericView("capital", "Capital ($)", parentElement, () => this.state.capital);
        this.buildNumericView("hour", "Hour", parentElement, () => this.state.hour);
        this.buildNumericView("day", "Day", parentElement, () => this.state.day);
        this.buildNumericView("age", "Age", parentElement, () => this.state.age);
    }

    buildNumericView(name, label, parentElement, updater) {
        const view = new NumericView(name, label, parentElement, updater);
        view.create();
        this.views.push(view);
    }

    // --- GAME LOGIC ---

    mainLoop() {
        // UPDATE
        this.updateCapital();
        this.updateTime();

        // RENDER
        this.views.forEach(view => view.update());
    }

    updateCapital() {
        this.state.capital++;
    }

    updateTime() {
        if (this.state.hour < 23) {
            this.state.hour++;
        }
        else {
            this.state.hour = 0;
            this.state.day++;
        }

        const isLeapYear = (Math.floor(this.state.age) % 4) == 0;

        if ((isLeapYear && this.state.day > 365) || (!isLeapYear && this.state.day > 364)) {
            this.state.day = 0;
        }

        this.state.age += 1 / (365.25 * 24);
    }

    // --- ENTRY POINT ---

    run() {
        this.initViews();

        setInterval(() => this.mainLoop(), 1000);
    }
}

window.onload = () => {
    const game = new Game();

    // Put in global scope for debug purposes
    // TODO: Figure out if there is a better way to achieve this
    window.game = game;

    game.run()
}
