class JobView {

    constructor(parentElement, updater) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.job = new Job("", "", 0.0, 0.0, 1.0);
    }

    create() {
        this.nameElement = document.createElement("p");
        this.nameElement.id = "job-name-view";
        this.parentElement.appendChild(this.nameElement);

        this.descriptionElement = document.createElement("p");
        this.parentElement.appendChild(this.descriptionElement);

        this.wageElement = document.createElement("p");
        this.parentElement.appendChild(this.wageElement);

        this.costsElement = document.createElement("p");
        this.parentElement.appendChild(this.costsElement);

        this.stressElement = document.createElement("p");
        this.parentElement.appendChild(this.stressElement);
    }

    update() {
        // Only update if the job was changed
        const oldName = this.job.name;
        this.job = this.updater();

        if (this.job.name != oldName) {
            this.nameElement.textContent = this.job.name;
            this.descriptionElement.textContent = this.job.description;
            this.wageElement.textContent = `Hourly wage (\$): ${this.job.wage.toFixed(2)}`;
            this.costsElement.textContent = `Living costs (\$): ${this.job.costs.toFixed(2)}`;
            this.stressElement.textContent = `Stress factor: ${this.job.stress.toFixed(2)}`;
        }
    }
}
