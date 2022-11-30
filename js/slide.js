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

    moveSlide(distX) {
        this.dist.moveFinal = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    updatePosition(clientX) {
        this.dist.moviment = this.dist.startMouseX - clientX;
        return this.dist.finalPosition - this.dist.moviment;
    }

    onStart(event) {
        event.preventDefault();
        this.dist.startMouseX = event.clientX;
        this.wrapper.addEventListener("mousemove", this.onMove);
    }

    onMove(event) {
        const finalPosition = this.updatePosition(event.clientX);
        this.moveSlide(finalPosition);

        // console.log(this.dist.startMouseX - event.clientX);
        // const finalPosition = this.updatePosition(this.startMouseX);
    }

    onEnd(event) {
        // console.log("finaliza");
        this.wrapper.removeEventListener("mousemove", this.onMove);
        this.dist.finalPosition = this.dist.moveFinal;
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