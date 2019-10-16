class LoansView {

    constructor(parentElement, updater, onLoanRepaid, onLoanTaken) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.onLoanTaken = onLoanTaken;
        this.onLoanRepaid = onLoanRepaid;
        this.loanViews = [];
    }

    create() {
        this.headerElement = document.createElement("h2");
        this.headerElement.textContent = "Loans";
        this.parentElement.appendChild(this.headerElement);

        this.infoView = new TextView("Intest is paid off daily", this.parentElement);
        this.infoView.create();

        this.interestView = new NumericView("loans-interest-view", "Interest rate", this.parentElement, () => this.updater().interestRate, true);
        this.interestView.create();

        this.amountView = new NumericView("loans-amount-view", "Loan amount ($)", this.parentElement, () => this.updater().baseAmount, true);
        this.amountView.create();

        const onTakeLoan = () => {
            const loan = this.updater().takeLoan();
            this.onLoanTaken(loan);
            this.update();
        }

        this.takeLoanButton = new Button("Take loan", this.parentElement, onTakeLoan);
        this.takeLoanButton.create();

        this.containerElement = document.createElement("div");
        this.containerElement.id = "loans-container";
        this.parentElement.appendChild(this.containerElement);
    }

    update() {
        const loans = this.updater();

        this.loanViews = [];

        while (this.containerElement.firstChild) {
            this.containerElement.removeChild(this.containerElement.firstChild);
        }

        loans.loans.forEach((loan, i) => {
            const onRepay = () => {
                loans.repayLoan(i);
                this.update(true);
                this.onLoanRepaid(loan);
            }

            const loanView = new LoanView(this.containerElement, () => loan, onRepay);
            loanView.create(i);
            this.loanViews.push(loanView);
        });

        this.headerElement.textContent = `Loans (${loans.loans.length})`;
        this.interestView.update();
        this.amountView.update();

        this.loanViews.forEach(view => view.update());
    }
}

class LoanView {

    constructor(parentElement, updater, onRepay) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.onRepay = onRepay;
    }

    create(index = 0) {
        this.containerElement = document.createElement("div");
        this.containerElement.className = "loan-view";
        this.parentElement.appendChild(this.containerElement);

        this.amountView = new NumericView(`loan-amount-${index}`, "Amount", this.containerElement, () => this.updater().amount, true);
        this.amountView.create();

        this.interestView = new NumericView(`loan-interest-${index}`, "Interest", this.containerElement, () => this.updater().interest, true);
        this.interestView.create();

        this.rejectButton = new Button("Repay", this.containerElement, this.onRepay);
        this.rejectButton.create();
    }

    update() {
        this.amountView.update();
        this.interestView.update();
    }
}
