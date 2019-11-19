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

        this.savingsAccountView = new SavingsAccountView(this.savingsAccountDiv, () => this.updater().savingsAccount, this.savingsAccountEvents.onDeposit, this.savingsAccountEvents.onWithdraw);
        this.savingsAccountView.create();
    }

    update() {
        this.savingsAccountView.update();
    }
}

class SavingsAccountView {

    constructor(parentElement, updater, onDeposit, onWithdraw) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.onDeposit = onDeposit;
        this.onWithdraw = onWithdraw;
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

        this.actionButtonsDiv = document.createElement("div");
        this.parentElement.appendChild(this.actionButtonsDiv);

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

        /*this.depositActions = new SavingsAccountActions(this.parentElement, this.updater, "Deposit", amount => {
            if (this.onDeposit(amount)) {
                this.updater().deposit(amount);
                this.update();
            }
        });
        this.depositActions.create();

        this.withdrawActions = new SavingsAccountActions(this.parentElement, this.updater, "Withdraw", amount => {
            const amountWithdrawn = this.updater().withdraw(amount);
            this.onWithdraw(amountWithdrawn);
            this.update();
        });
        this.withdrawActions.create();*/
    }

    update() {
        this.balanceView.update();
        this.interestView.update();
    }
}

class SavingsAccountActions {

    constructor(parentElement, updater, actionLabel, onAction) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.actionLabel = actionLabel;
        this.onAction = onAction;
    }

    create() {
        this.containerDiv = document.createElement("div");
        this.parentElement.appendChild(this.containerDiv);

        this.amountInput = document.createElement("input");
        this.amountInput.type = "number";
        this.amountInput.value = 0.0;
        this.containerDiv.appendChild(this.amountInput);

        const onZero = () => {
            this.amountInput.value = 0.0;
        }
        this.zeroButton = new Button("0", this.containerDiv, onZero);
        this.zeroButton.create();

        const onPlusOne = () => {
            this.amountInput.value = parseFloat(this.amountInput.value) + 1.0;
        }
        this.plusOneButton = new Button("+1", this.containerDiv, onPlusOne);
        this.plusOneButton.create();

        const onTenPercent = () => {
            this.amountInput.value = (this.updater().balance * 0.1).toFixed(2);
        }
        this.tenPercentButton = new Button("10%", this.containerDiv, onTenPercent);
        this.tenPercentButton.create();

        const onQuarter = () => {
            this.amountInput.value = (this.updater().balance * 0.25).toFixed(2);
        }
        this.quarterButton = new Button("25%", this.containerDiv, onQuarter);
        this.quarterButton.create();

        const onHalf = () => {
            this.amountInput.value = (this.updater().balance * 0.5).toFixed(2);
        }
        this.halfButton = new Button("50%", this.containerDiv, onHalf);
        this.halfButton.create();

        const onThreeQuarters = () => {
            this.amountInput.value = (this.updater().balance * 0.75).toFixed(2);
        }
        this.threeQuartersButton = new Button("75%", this.containerDiv, onThreeQuarters);
        this.threeQuartersButton.create();

        const onActionButton = () => {
            this.onAction(parseFloat(this.amountInput.value));
            onZero();
        }
        this.actionButton = new Button(this.actionLabel, this.containerDiv, onActionButton);
        this.actionButton.create();
    }

    update() {

    }
}
