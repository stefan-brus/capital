class Game {

    // --- INIT LOGIC ---

    constructor() {
        // TODO: Figure out better state version handling
        const VERSION = 2;
        this.state = {};
        this.state.version = VERSION;
        this.state.capital = 0;
        this.state.hour = 0;
        this.state.day = 0;
        this.state.year = 0;
        this.state.age = 18;
        this.state.baseCosts = 0.01;
        this.state.baseStress = 1.0;

        const unemployed = new Job(
            "Unemployed",
            "You do nothing. The government pays for your basic subsistence.",
            0.0,
            0.0,
            1.0
        );

        this.state.job = unemployed;
        this.state.availableJobs = new AvailableJobs();
        this.state.availableJobs.generate();

        this.views = [];
    }

    initViews() {
        const statsDiv = document.createElement("div");
        statsDiv.id = "stats-layout";
        document.body.appendChild(statsDiv);

        this.buildNumericView("capital", "Capital ($)", statsDiv, () => this.state.capital, true);
        this.buildNumericView("hour", "Hour", statsDiv, () => this.state.hour);
        this.buildNumericView("day", "Day", statsDiv, () => this.state.day);
        this.buildNumericView("year", "Year", statsDiv, () => this.state.year);
        this.buildNumericView("age", "Age", statsDiv, () => this.state.age, true);
        this.buildNumericView("expenses", "Expenses", statsDiv, () => this.getTotalCosts(), true);
        this.buildNumericView("stress", "Stress", statsDiv, () => this.getTotalStress(), true);

        const jobDiv = document.createElement("div");
        jobDiv.id = "job-layout";
        document.body.appendChild(jobDiv);

        this.buildJobView(jobDiv, () => this.state.job);

        const availableDiv = document.createElement("div");
        availableDiv.id = "available-jobs-layout";
        document.body.appendChild(availableDiv);

        this.buildAvailableJobsview(availableDiv, () => this.state.availableJobs);
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

    buildAvailableJobsview(parentElement, updater) {
        const onHire = job => this.state.job = job;
        const view = new AvailableJobsView(parentElement, updater, onHire);
        view.create();
        view.update(true);
        this.views.push(view);
    }

    // --- GAME LOGIC ---

    mainLoop() {
        // UPDATE
        this.updateCapital();
        this.updateTime();

        // RENDER
        this.views.forEach(view => view.update());

        // SAVE
        localStorage.setItem("state", JSON.stringify(this.state));
    }

    getTotalCosts() {
        return this.state.baseCosts + this.state.job.costs;
    }

    getTotalStress() {
        return this.state.baseStress * this.state.job.stress;
    }

    updateCapital() {
        this.state.capital += this.state.job.wage;
        this.state.capital -= this.getTotalCosts();
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
            this.state.year++;
        }

        this.state.age += this.state.job.stress / (365.25 * 24);

        if (this.state.availableJobs.refreshTimer > 0) {
            this.state.availableJobs.refreshTimer--;
        }
    }

    // --- ENTRY POINT ---

    run() {
        const savedState = JSON.parse(localStorage.getItem("state"));
        if (savedState && savedState.version == this.state.version) {
            this.loadSavedState(savedState);
        }

        this.initViews();

        setInterval(() => this.mainLoop(), 1000);
        this.mainLoop();
    }

    loadSavedState(saved) {
        this.state.capital = saved.capital;
        this.state.hour = saved.hour;
        this.state.day = saved.day;
        this.state.year = saved.year;
        this.state.age = saved.age;
        this.state.job = saved.job;

        this.state.availableJobs.level = saved.availableJobs.level;
        this.state.availableJobs.jobs = saved.availableJobs.jobs;
        this.state.availableJobs.refreshCooldown = saved.availableJobs.refreshCooldown;
        this.state.availableJobs.refreshTimer = saved.availableJobs.refreshTimer;
    }
}

window.onload = () => {
    const game = new Game();

    // Put in global scope for debug purposes
    // TODO: Figure out if there is a better way to achieve this
    window.game = game;

    game.run()
}
