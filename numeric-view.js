class NumericView {

    constructor(name, label, parentElement, updater, isDecimal) {
        this.name = name;
        this.label = label;
        this.parentElement = parentElement;
        this.updater = updater;
        this.isDecimal = isDecimal;
    }

    create() {
        const element = document.createElement("p");
        element.innerHTML = `${this.label}: <span id="numeric-view-${this.name}">0</span>`;
        this.parentElement.appendChild(element);
    }

    update() {
        const newVal = this.updater();
        document.getElementById(`numeric-view-${this.name}`).textContent = this.isDecimal ? newVal.toFixed(2) : newVal;
    }
}
