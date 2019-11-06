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
    }

    withdraw(desiredAmount) {
        const amountWithdrawn = desiredAmount > this.balance ? this.balance : desiredAmount;
        this.balance -= amountWithdrawn;
        return amountWithdrawn;
    }

    deposit(desiredAmount) {
        this.balance += desiredAmount;
    }

    onDailyUpdate() {
        this.balance += this.balance * this.interest;
    }
}
