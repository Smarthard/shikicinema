export default class PlayerEdit {

    constructor(label, input_options) {
        this.label = label;
        this.input_options = input_options;
        this.element = document.createElement('div');
        this.edit = document.createElement('input');

        this.init();
    }

    init() {
        let wrapper = this.element;
        let edit = this.edit;
        let label = document.createElement('span');

        wrapper.appendChild(label);
        wrapper.appendChild(edit);
        wrapper.classList.add('control-box');

        edit.type = 'text';

        if (this.input_options) {
            if (this.input_options.pattern) {
                edit.pattern = this.input_options.pattern;
            }
        }

        label.classList.add('label');
        label.textContent = this.label;
    }

    getLabel() {
        return this.label;
    }

    setLabel(label) {
        this.label = label;
    }

    getEdit() {
        return this.edit
    }


}
