class Game {

    // --- INIT LOGIC ---

    constructor() {
        this.state = {};
        this.state.capital = 0;
        this.state.hour = 0;
        this.state.day = 0;
        this.state.age = 18;

        const unemployed = new Job(
            "Unemployed",
            "You do nothing. The government pays for your basic subsistence.",
            0.0,
            0.0,
            1.0
        );

        this.state.job = unemployed;

        this.views = [];
    }

    initViews() {
        const statsDiv = document.createElement("div");
        statsDiv.id = "stats-layout";
        document.body.appendChild(statsDiv);

        this.buildNumericView("capital", "Capital ($)", statsDiv, () => this.state.capital, true);
        this.buildNumericView("hour", "Hour", statsDiv, () => this.state.hour);
        this.buildNumericView("day", "Day", statsDiv, () => this.state.day);
        this.buildNumericView("age", "Age", statsDiv, () => this.state.age, true);

        const jobDiv = document.createElement("div");
        jobDiv.id = "job-layout";
        document.body.appendChild(jobDiv);

        this.buildJobView(jobDiv, () => this.state.job);
    }

    buildNumericView(name, label, parentElement, updater, isDecimal = false) {
        const view = new NumericView(name, label, parentElement, updater, isDecimal);
        view.create();
        this.views.push(view);
    }

    buildJobView(parentElement, updater) {
        const view = new JobView(parentElement, updater);
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
        this.state.capital += this.state.job.wage;
        this.state.capital -= this.state.job.costs;
    }

    updateTime() {
        if (this.state.hour < 23) {
            this.state.hour++;
        }
        else {
            this.state.hour = 0;
            this.state.day++;
        }

        if (this.state.day > 364) {
            this.state.day = 0;
        }

        this.state.age += this.state.job.stress / (365.25 * 24);
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
