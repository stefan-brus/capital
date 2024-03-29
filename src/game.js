class Game {

    // --- INIT LOGIC ---

    constructor() {
        this.state = {};
        this.state.version = VERSION;
        this.state.capital = 1.0;
        this.state.hour = 0;
        this.state.day = 0;
        this.state.year = 0;
        this.state.age = 18.0;
        this.state.wageFactor = 1.0;
        this.state.baseCosts = 0.01;
        this.state.costsFactor = 1.0;
        this.state.baseStress = 1.0;
        this.state.stressFactor = 1.0;

        const unemployed = new Job(
            "Unemployed",
            "You do nothing. The government pays for your basic subsistence.",
            0.0,
            0.0,
            1.0
        );

        this.state.job = unemployed;

        this.state.loans = new Loans();

        const onCareerUpgrade = () => {
            this.state.costsFactor *= 2.0;
            this.state.stressFactor *= 2.0;
        }
        const onCareerFinished = () => {
            this.state.costsFactor *= 0.5;
            this.state.stressFactor *= 0.5;
            this.state.availableJobs.maxLevel++;

            const isRefreshTimerTicking =
                this.state.availableJobs.refreshTimer < this.state.availableJobs.refreshCooldown &&
                this.state.availableJobs.refreshTimer > 0;
            if (isRefreshTimerTicking) {
                this.state.availableJobs.refreshTimer *= 0.5;
            }
            this.state.availableJobs.refreshCooldown *= 0.5;
        }

        const onNetworkUpgrade = (networking) => {
            onCareerUpgrade();
            this.state.capital -= networking.investment;
        };
        const onNetworkFinished = () => {
            onCareerFinished();
            this.state.baseStress += 0.01;
        };
        const isNetworkUnlocked = () => {
            return this.state.job.name != "Unemployed";
        };

        const onEducationUpgrade = () => {
            onCareerUpgrade();
            this.state.wageFactor *= 0.5;
        };
        const onEducationFinished = () => {
            onCareerFinished();
            this.state.wageFactor *= 2.0;
            this.state.baseCosts += 0.01;
        };
        const isEducationUnlocked = () => {
            return this.state.capital >= 10.0;
        };

        this.state.career = new Career(onNetworkUpgrade, onNetworkFinished, isNetworkUnlocked, onEducationUpgrade, onEducationFinished, isEducationUnlocked);

        this.state.availableJobs = new AvailableJobs();
        this.state.availableJobs.generate();

        this.state.passiveIncome = new PassiveIncome();

        this.views = [];
    }

    initViews() {
        this.gameContainer = document.createElement("div");
        document.body.appendChild(this.gameContainer);

        this.headerElement = document.createElement("h1");
        this.headerElement.textContent = "Capital";
        this.gameContainer.appendChild(this.headerElement);

        this.leftContainer = document.createElement("div");
        this.leftContainer.id = "left-container";
        this.gameContainer.appendChild(this.leftContainer);

        this.loansDiv = document.createElement("div");
        this.loansDiv.id = "loans-layout";
        this.leftContainer.appendChild(this.loansDiv);

        this.buildLoansView(this.loansDiv, () => this.state.loans);

        this.statsHeader = document.createElement("h2");
        this.statsHeader.textContent = "You";
        this.leftContainer.appendChild(this.statsHeader);

        const statsDiv = document.createElement("div");
        statsDiv.id = "stats-layout";
        this.leftContainer.appendChild(statsDiv);

        this.buildNumericView("capital", "Capital ($)", statsDiv, () => this.state.capital, true);
        this.buildNumericView("income", "Income ($)", statsDiv, () => this.getTotalIncome(), true);
        this.buildNumericView("hour", "Hour", statsDiv, () => this.state.hour);
        this.buildNumericView("day", "Day", statsDiv, () => this.state.day);
        this.buildNumericView("year", "Year", statsDiv, () => this.state.year);
        this.buildNumericView("age", "Age", statsDiv, () => this.state.age, true);
        this.buildNumericView("expenses", "Expenses ($)", statsDiv, () => this.getTotalCosts(), true);
        this.buildNumericView("stress", "Stress", statsDiv, () => this.getTotalStress(), true);

        const jobDiv = document.createElement("div");
        jobDiv.id = "job-layout";
        this.leftContainer.appendChild(jobDiv);

        this.buildJobView(jobDiv, () => this.state.job);

        this.careerDiv = document.createElement("div");
        this.careerDiv.id = "career-layout";
        this.leftContainer.appendChild(this.careerDiv);

        this.buildCareerView(this.careerDiv, () => this.state.career);

        const availableDiv = document.createElement("div");
        availableDiv.id = "available-jobs-layout";
        this.leftContainer.appendChild(availableDiv);

        this.buildAvailableJobsview(availableDiv, () => this.state.availableJobs);

        this.rightContainer = document.createElement("div");
        this.rightContainer.id = "right-container";
        this.gameContainer.appendChild(this.rightContainer);

        this.passiveIncomeDiv = document.createElement("div");
        this.passiveIncomeDiv.id = "passive-income-layout";
        this.rightContainer.appendChild(this.passiveIncomeDiv);

        this.buildPassiveIncomeView(this.passiveIncomeDiv, () => this.state.passiveIncome)
    }

    buildNumericView(name, label, parentElement, updater, isDecimal = false) {
        const view = new NumericView(name, label, parentElement, updater, isDecimal);
        view.create();
        this.views.push(view);
    }

    buildLoansView(parentElement, updater) {
        const onLoanRepaid = loan => this.state.capital -= loan.amount;
        const onLoanTaken = loan => this.state.capital += loan.amount;
        const view = new LoansView(parentElement, updater, onLoanRepaid, onLoanTaken);
        view.create();
        view.update(true);
        this.views.push(view);
    }

    buildJobView(parentElement, updater) {
        const view = new JobView(parentElement, updater);
        view.create();
        this.views.push(view);
    }

    buildCareerView(parentElement, updater) {
        const view = new CareerView(parentElement, updater);
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

    buildPassiveIncomeView(parentElement, updater) {
        const savingsAccountEvents = {
            onDeposit: amount => {
                if (amount > this.state.capital) {
                    return false;
                }

                this.state.capital -= amount;
                return true;
            },

            onWithdraw: amount => {
                this.state.capital += amount;
            },

            onUpgrade: amount => {
                this.state.capital -= amount;
            }
        }
        const view = new PassiveIncomeView(parentElement, updater, savingsAccountEvents);
        view.create();
        view.update();
        this.views.push(view);
    }

    // --- GAME LOGIC ---

    mainLoop() {
        // UPDATE
        this.updateCapital();
        this.updateLoans();
        this.updatePassiveIncome();
        this.updateTime();
        this.state.career.finishCompletedUpgrades();

        // RENDER
        this.render();

        // SAVE
        localStorage.setItem("state", JSON.stringify(this.state));
    }

    render() {
        if (this.state.job.name == "Unemployed") {
            this.passiveIncomeDiv.style.display = "none";
        }
        else {
            this.passiveIncomeDiv.style.display = "inline";
        }

        this.views.forEach(view => view.update());
    }

    getTotalIncome() {
        return (this.state.wageFactor * this.state.job.wage) - this.getTotalCosts();
    }

    getTotalCosts() {
        return this.state.costsFactor * (this.state.baseCosts + this.state.job.costs);
    }

    getTotalStress() {
        return this.state.stressFactor * this.state.baseStress * this.state.job.stress;
    }

    updateCapital() {
        this.state.capital += this.state.wageFactor * this.state.job.wage;
        this.state.capital -= this.getTotalCosts();
    }

    updateLoans() {
        // Update loan base amount
        this.state.loans.baseAmount = this.getTotalCosts() * 10;

        // Repay existing loans daily
        if (this.state.hour == 23) {
            this.state.loans.loans.forEach(loan => {
                const payment = loan.amount * loan.interest;
                this.state.capital -= payment;
            });
        }

        // If capital is negative, take loans until positive
        while (this.state.capital < 0) {
            const loan = this.state.loans.takeLoan();
            this.state.capital += loan.amount;
        }
    }

    updatePassiveIncome() {
        if (this.state.hour == 23) {
            this.state.passiveIncome.onDailyUpdate();
        }
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

        this.state.age += this.getTotalStress() / (365 * 24);

        function decrementOrZero(timer) {
            if (timer <= 1.0) {
                timer = 0;
            }
            else {
                timer--;
            }

            return timer;
        }

        this.state.availableJobs.refreshTimer = decrementOrZero(this.state.availableJobs.refreshTimer);
        this.state.career.networking.upgradeTimer = decrementOrZero(this.state.career.networking.upgradeTimer);
        this.state.career.education.upgradeTimer = decrementOrZero(this.state.career.education.upgradeTimer);
    }

    // --- ENTRY POINT ---

    run() {
        const savedState = JSON.parse(localStorage.getItem("state"));
        if (savedState && savedState.version == this.state.version) {
            this.loadSavedState(savedState);
        }

        this.initViews();

        setInterval(() => this.mainLoop(), 1000);
    }

    loadSavedState(saved) {
        this.state.capital = saved.capital;
        this.state.hour = saved.hour;
        this.state.day = saved.day;
        this.state.year = saved.year;
        this.state.age = saved.age;
        this.state.wageFactor = saved.wageFactor;
        this.state.baseCosts = saved.baseCosts;
        this.state.costsFactor = saved.costsFactor;
        this.state.baseStress = saved.baseStress;
        this.state.stressFactor = saved.stressFactor;

        this.state.job = saved.job;

        this.state.loans.interestRate = saved.loans.interestRate;
        this.state.loans.baseAmount = saved.loans.baseAmount;
        this.state.loans.loans = saved.loans.loans;

        this.state.passiveIncome.savingsAccount.balance = saved.passiveIncome.savingsAccount.balance;
        this.state.passiveIncome.savingsAccount.interest = saved.passiveIncome.savingsAccount.interest;
        this.state.passiveIncome.savingsAccount.upgradeThreshold = saved.passiveIncome.savingsAccount.upgradeThreshold;

        this.state.career.networking.level = saved.career.networking.level;
        this.state.career.networking.duration = saved.career.networking.duration;
        this.state.career.networking.upgradeTimer = saved.career.networking.upgradeTimer;
        this.state.career.networking.upgradeStarted = saved.career.networking.upgradeStarted;
        this.state.career.networking.investment = saved.career.networking.investment;
        this.state.career.networking.available = saved.career.networking.available;

        this.state.career.education.level = saved.career.education.level;
        this.state.career.education.duration = saved.career.education.duration;
        this.state.career.education.upgradeTimer = saved.career.education.upgradeTimer;
        this.state.career.education.upgradeStarted = saved.career.education.upgradeStarted;
        this.state.career.education.available = saved.career.education.available;

        this.state.availableJobs.maxLevel = saved.availableJobs.maxLevel;
        this.state.availableJobs.jobs = saved.availableJobs.jobs;
        this.state.availableJobs.refreshCooldown = saved.availableJobs.refreshCooldown;
        this.state.availableJobs.refreshTimer = saved.availableJobs.refreshTimer;
    }
}

window.onload = () => {
    const game = new Game();

    // Put in global scope for all kinds of purposes
    // Use this very carefully
    // TODO: Figure out if there is a better way to achieve this
    window.game = game;

    game.run()
}
