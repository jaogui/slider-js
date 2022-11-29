export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
    }

    onStart(event) {
        event.preventDefault();
        console.log(event);
    }

    addSlideEvents() {
        this.wrapper.addEventListener("mousedown", this.onStart);
    }

    init() {
        this.addSlideEvents();

        return this;
    }
}