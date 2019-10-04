class Career {

    constructor(state) {
        this.state = state;
        this.networking = new Networking(state);
        this.education = new Education(state);
    }
}

class Networking {

    constructor(state) {
        this.state = state;
        this.level = 0;
        this.isUpgrading = false;
        this.duration = 24;
        this.upgradeTimer = 0;
        this.investment = 5.0;
    }

    upgrade() {
        this.state.capital -= this.investment;
        this.state.costsFactor *= 2.0;
        this.state.stressFactor *= 2.0;
    }

    onUpgradeFinished() {
        this.state.costsFactor *= 0.5;
        this.state.stressFactor *= 0.5;
        this.state.availableJobs.maxLevel++;
        this.state.baseStress += 0.01;
    }
}

class Education {

    constructor(state) {
        this.state = state;
        this.level = 0;
        this.isUpgrading = false;
        this.duration = 24;
        this.upgradeTimer = 0;
    }

    upgrade() {
        this.state.wageFactor *= 0.5;
        this.state.costsFactor *= 2.0;
        this.state.stressFactor *= 2.0;
    }

    onUpgradeFinished() {
        this.state.costsFactor *= 0.5;
        this.state.stressFactor *= 0.5;
        this.state.availableJobs.maxLevel++;
        this.state.baseCosts += 0.01;
    }
}
