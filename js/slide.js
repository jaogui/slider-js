export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = {
            finalPosition: 0,
            startMouseX: 0,
            moviment: 0,
        };
    }

    updatePosition(clientX) {
        this.dist.moviment = this.dist.startMouseX - clientX;
    }

    onStart(event) {
        event.preventDefault();
        this.dist.startMouseX = event.clientX;
        console.log(this.dist.startMouseX);
        this.wrapper.addEventListener("mousemove", this.onMove);
    }

    onMove(event) {
        console.log("moveu");
    }

    onEnd(event) {
        console.log("finaliza");
        this.wrapper.removeEventListener("mousemove", this.onMove);
    }

    addSlideEvents() {
        this.wrapper.addEventListener("mousedown", this.onStart);
        this.wrapper.addEventListener("mouseup", this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}