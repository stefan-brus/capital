class TextView {

    constructor(text, parentElement) {
        this.text = text;
        this.parentElement = parentElement;
    }

    create() {
        this.element = document.createElement("p");
        this.element.className = "text-view";
        this.element.textContent = this.text;
        this.parentElement.appendChild(this.element);
    }
}
