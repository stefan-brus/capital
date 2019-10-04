class AvailableJobsView {

    constructor(parentElement, updater) {
        this.parentElement = parentElement;
        this.updater = updater;
        this.availableViews = [];
    }

    create() {
        const headerElement = document.createElement("h2");
        headerElement.textContent = "Available Jobs";
        this.parentElement.appendChild(headerElement);

        this.containerElement = document.createElement("div");
        this.containerElement.id = "available-jobs-container";
        this.parentElement.appendChild(this.containerElement);
    }

    update(refresh = false) {
        if (refresh) {
            const available = this.updater();
            this.availableViews = [];

            while (this.containerElement.firstChild) {
                this.containerElement.removeChild(this.containerElement.firstChild);
            }

            available.jobs.forEach((job, i) => {
                const availableJobView = new AvailableJobView(this.containerElement, () => job);
                availableJobView.create(i);
                this.availableViews.push(availableJobView);
            });
        }

        this.availableViews.forEach(view => view.update());
    }
}

class AvailableJobView {

    constructor(parentElement, updater) {
        this.parentElement = parentElement;
        this.updater = updater;
    }

    create(index = 0) {
        this.containerElement = document.createElement("div");
        this.containerElement.className = "available-job-view";
        this.parentElement.appendChild(this.containerElement);

        this.nameElement = document.createElement("p");
        this.nameElement.className = "available-job-name-view";
        this.containerElement.appendChild(this.nameElement);

        this.wageElement = new NumericView(`available-job-wage-${index}`, "Wage", this.containerElement, () => this.updater().wage, true);
        this.wageElement.create();

        this.costsElement = new NumericView(`available-job-costs-${index}`, "Costs", this.containerElement, () => this.updater().costs, true);
        this.costsElement.create();

        this.stressElement = new NumericView(`available-job-stress-${index}`, "Stress", this.containerElement, () => this.updater().stress, true);
        this.stressElement.create();
    }

    update() {
        const job = this.updater();

        this.nameElement.textContent = job.name;
        this.wageElement.update();
        this.costsElement.update();
        this.stressElement.update();
    }
}
