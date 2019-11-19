class PassiveIncomeView {

    constructor(parentElement, updater, savingsAccountEvents) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.savingsAccountEvents = savingsAccountEvents;
    }

    create() {
        this.headerElement = document.createElement("h2");
        this.headerElement.textContent = "Passive Income";
        this.parentElement.appendChild(this.headerElement);

        this.savingsAccountDiv = document.createElement("div");
        this.savingsAccountDiv.id = "savings-account-view";
        this.parentElement.appendChild(this.savingsAccountDiv);

        this.savingsAccountView = new SavingsAccountView(this.savingsAccountDiv, () => this.updater().savingsAccount,
            this.savingsAccountEvents.onDeposit,
            this.savingsAccountEvents.onWithdraw,
            this.savingsAccountEvents.onUpgrade);
        this.savingsAccountView.create();
    }

    update() {
        this.savingsAccountView.update();
    }
}

class SavingsAccountView {

    constructor(parentElement, updater, onDeposit, onWithdraw, onUpgrade) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.onDeposit = onDeposit;
        this.onWithdraw = onWithdraw;
        this.onUpgrade = onUpgrade;
    }

    create() {
        this.headerElement = document.createElement("h3");
        this.headerElement.textContent = "Savings Account";
        this.parentElement.appendChild(this.headerElement);

        this.balanceView = new NumericView("savings-account-balance-view", "Balance ($)", this.parentElement, () => this.updater().balance, true);
        this.balanceView.create();

        this.interestView = new PercentView("savings-account-interest-view", "Daily interest", this.parentElement, () => this.updater().interest);
        this.interestView.create();

        this.actionsDiv = document.createElement("div");
        this.parentElement.appendChild(this.actionsDiv);

        this.amountInput = document.createElement("input");
        this.amountInput.type = "number";
        this.amountInput.value = 0.0;
        this.actionsDiv.appendChild(this.amountInput);

        const onZero = () => {
            this.amountInput.value = 0.0;
        }
        this.zeroButton = new Button("0", this.actionsDiv, onZero);
        this.zeroButton.create();

        const onPlusOne = () => {
            this.amountInput.value = parseFloat(this.amountInput.value) + 1.0;
        }
        this.plusOneButton = new Button("+1", this.actionsDiv, onPlusOne);
        this.plusOneButton.create();

        const onTenPercent = () => {
            this.amountInput.value = (this.updater().balance * 0.1).toFixed(2);
        }
        this.tenPercentButton = new Button("10%", this.actionsDiv, onTenPercent);
        this.tenPercentButton.create();

        const onQuarter = () => {
            this.amountInput.value = (this.updater().balance * 0.25).toFixed(2);
        }
        this.quarterButton = new Button("25%", this.actionsDiv, onQuarter);
        this.quarterButton.create();

        const onHalf = () => {
            this.amountInput.value = (this.updater().balance * 0.5).toFixed(2);
        }
        this.halfButton = new Button("50%", this.actionsDiv, onHalf);
        this.halfButton.create();

        const onThreeQuarters = () => {
            this.amountInput.value = (this.updater().balance * 0.75).toFixed(2);
        }
        this.threeQuartersButton = new Button("75%", this.actionsDiv, onThreeQuarters);
        this.threeQuartersButton.create();

        const onDepositAction = () => {
            const amount = parseFloat(this.amountInput.value);
            if (this.onDeposit(amount)) {
                this.updater().deposit(amount);
                this.update();
            }
        }

        this.actionButtonsDiv = document.createElement("div");
        this.parentElement.appendChild(this.actionButtonsDiv);

        this.depositButton = new Button("Deposit", this.actionButtonsDiv, onDepositAction);
        this.depositButton.create();

        const onWithdrawAction = () => {
            const amount = parseFloat(this.amountInput.value);
            const amountWithdrawn = this.updater().withdraw(amount);
            this.onWithdraw(amountWithdrawn);
            this.update();
        }

        this.withdrawButton = new Button("Withdraw", this.actionButtonsDiv, onWithdrawAction);
        this.withdrawButton.create();

        this.upgradeDiv = document.createElement("div");
        this.parentElement.appendChild(this.upgradeDiv);

        this.upgradeView = new TextView("Next upgrade at $0.00 saved", this.upgradeDiv);
        this.upgradeView.create();

        const onUpgradeAction = () => {
            this.onUpgrade(this.updater().upgradeThreshold);
            this.updater().upgrade();
            this.update();
        }
        this.upgradeButton = new Button("Upgrade ($0.00)", this.upgradeDiv, onUpgradeAction);
        this.upgradeButton.create();
    }

    update() {
        this.balanceView.update();
        this.interestView.update();

        this.upgradeView.text = `Next upgrade at $${this.updater().upgradeThreshold.toFixed(2)} saved`
        this.upgradeView.update();

        const savings = this.updater();
        if (savings.balance >= savings.upgradeThreshold) {
            this.upgradeButton.buttonDiv.style.display = "inline-block";
            this.upgradeButton.buttonDiv.textContent = `Upgrade ($${savings.upgradeThreshold.toFixed(2)})`;
        }
        else {
            this.upgradeButton.buttonDiv.style.display = "none";
        }
    }
}
