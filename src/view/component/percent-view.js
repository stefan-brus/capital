class PercentView extends NumericView {

    constructor(name, label, parentElement, updater) {
        super(name, label, parentElement, updater, true, 2);
    }

    update() {
        const newVal = this.updater();
        this.viewElement.textContent = (newVal * 100.0).toFixed(this.numDecimals) + "%";
    }
}
