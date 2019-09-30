class Game {

    constructor() {
        this.capital = 0;

        this.views = [];
    }

    mainLoop() {
        // UPDATE
        this.capital++;

        // RENDER
        this.views.forEach(view => view.update());
    }

    run() {
        this.initViews();

        setInterval(() => this.mainLoop(), 1000);
    }

    initViews() {
        const parentElement = document.body;

        const capitalView = new NumericView("capital", "Capital", parentElement, () => this.capital);
        capitalView.create();
        this.views.push(capitalView);
    }
}

window.onload = () => {
    const game = new Game();
    game.run()
}
