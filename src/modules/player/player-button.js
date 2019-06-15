export default class PlayerButton {

    constructor(img, label) {
        this.img = img;
        this.label = label;
        this.element = document.createElement('div');

        this.init();
    }

    init() {
        let wrapper = this.element;
        let button = document.createElement('button');
        let label = document.createElement('div');

        wrapper.appendChild(button);
        wrapper.appendChild(label);
        wrapper.classList.add('control-box');

        button.innerHTML = `<img height="25vh" src='${this.img}' alt='${this.label}'>`;
        button.classList.add('shikicinema-controls-button');

        label.classList.add('label');
        label.textContent = this.label;
    }

    getImage() {
        return this.img;
    }

    setImage(img) {
        this.img = img;
    }

    getLabel() {
        return this.label;
    }

    setLabel(label) {
        this.label = label;
    }


}
