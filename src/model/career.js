class Career {

    constructor(onNetworkUpgrade, onNetworkFinished, isNetworkUnlocked, onEducationUpgrade, onEducationFinished, isEducationUnlocked) {
        this.networking = new Networking(onNetworkUpgrade, onNetworkFinished, isNetworkUnlocked);
        this.education = new Education(onEducationUpgrade, onEducationFinished, isEducationUnlocked);
    }

    finishCompletedUpgrades() {
        if (this.networking.upgradeStarted && this.networking.upgradeTimer == 0) {
            this.networking.onUpgradeFinished();
        }

        if (this.education.upgradeStarted && this.education.upgradeTimer == 0) {
            this.education.onUpgradeFinished();
        }
    }
}

class Networking {

    constructor(onNetworkUpgrade, onNetworkFinished, isNetworkUnlocked) {
        this.onNetworkUpgrade = onNetworkUpgrade;
        this.onNetworkFinished = onNetworkFinished;
        this.level = 0;
        this.duration = 24;
        this.upgradeTimer = 0;
        this.upgradeStarted = false;
        this.investment = 1.0;
        this.unlocked = isNetworkUnlocked;
        this.available = false;
    }

    isAvailable() {
        if (this.unlocked()) {
            this.available = true;
        }

        return this.available;
    }

    upgrade() {
        this.onNetworkUpgrade(this);
        this.upgradeStarted = true;
        this.upgradeTimer = this.duration;
    }

    onUpgradeFinished() {
        this.onNetworkFinished(this);
        this.investment *= 2.0;
        this.upgradeStarted = false;
        this.duration *= 2;
        this.level++;
    }
}

class Education {

    constructor(onEducationUpgrade, onEducationFinished, isEducationUnlocked) {
        this.onEducationUpgrade = onEducationUpgrade;
        this.onEducationFinished = onEducationFinished;
        this.level = 0;
        this.duration = 24;
        this.upgradeTimer = 0;
        this.upgradeStarted = false;
        this.unlocked = isEducationUnlocked;
        this.available = false;
    }

    isAvailable() {
        if (this.unlocked()) {
            this.available = true;
        }

        return this.available;
    }

    upgrade() {
        this.onEducationUpgrade(this);
        this.upgradeStarted = true;
        this.upgradeTimer = this.duration;
    }

    onUpgradeFinished() {
        this.onEducationFinished(this);
        this.upgradeStarted = false;
        this.duration *= 2;
        this.level++;
    }
}
