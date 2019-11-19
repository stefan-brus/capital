class PassiveIncome {

    constructor() {
        this.savingsAccount = new SavingsAccount();
    }

    onDailyUpdate() {
        this.savingsAccount.onDailyUpdate();
    }
}

class SavingsAccount {

    constructor() {
        this.balance = 0.0;
        this.interest = 0.0001;
        this.upgradeThreshold = 1.0;
    }

    withdraw(desiredAmount) {
        const amountWithdrawn = desiredAmount > this.balance ? this.balance : desiredAmount;
        this.balance -= amountWithdrawn;
        return amountWithdrawn;
    }

    deposit(desiredAmount) {
        this.balance += desiredAmount;
    }

    upgrade() {
        this.interest += 0.0001;
        this.upgradeThreshold *= 10.0;
    }

    onDailyUpdate() {
        this.balance += this.balance * this.interest;
    }
}
