class Loans {

    constructor() {
        this.interestRate = 0.01;
        this.baseAmount = 0;
        this.loans = [];
    }

    takeLoan() {
        const loan = new Loan(this.baseAmount, this.interestRate);
        this.loans.push(loan);
        this.interestRate += 0.01;
        return loan;
    }

    repayLoan(index) {
        this.loans.splice(index, 1);
        this.interestRate -= 0.01;
    }
}

class Loan {
    constructor(amount, interest) {
        this.amount = amount;
        this.interest = interest;
    }
}
