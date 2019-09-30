class NumericView {

    constructor(name, label, parentElement, updater) {
        this.name = name;
        this.label = label;
        this.parentElement = parentElement;
        this.updater = updater;
    }

    create() {
        const element = document.createElement("p");
        //const text = document.createTextNode(`${this.label}: <span id="numeric-view-${this.name}">0</span>`);
        //element.appendChild(text);
        element.innerHTML = `${this.label}: <span id="numeric-view-${this.name}">0</span>`;
        this.parentElement.appendChild(element);
    }

    update() {
        document.getElementById(`numeric-view-${this.name}`).textContent = this.updater();
    }
}
