class Button {

    constructor(label, parentElement, onClick) {
        this.label = label;
        this.parentElement = parentElement;
        this.onClick = onClick;
    }

    create() {
        const buttonDiv = document.createElement("div");
        buttonDiv.className = "button";
        buttonDiv.textContent = this.label;
        buttonDiv.onclick = this.onClick;
        this.parentElement.appendChild(buttonDiv);
    }
}
