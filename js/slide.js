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
        this.dist.moviment = (this.dist.startMouseX - clientX) * 1.5;
        return this.dist.finalPosition - this.dist.moviment;
    }

    onStart(event) {
        let movetype;
        if (event.type === "mousedown") {
            event.preventDefault();
            this.dist.startMouseX = event.clientX;
            movetype = "mousemove";
        } else {
            this.dist.startMouseX = event.changedTouches[0].clientX;
            movetype = "touchmove";
        }
        this.wrapper.addEventListener(movetype, this.onMove);
    }

    onMove(event) {
        const pointerPosition =
            event.type === "mousemove" ?
            event.clientX :
            event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.moveFinal;
        // console.log("finaliza");
    }

    addSlideEvents() {
        this.wrapper.addEventListener("mousedown", this.onStart);
        this.wrapper.addEventListener("touchstart", this.onStart);
        this.wrapper.addEventListener("touchend", this.onEnd);
        this.wrapper.addEventListener("mouseup", this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        console.log(margin);

        return -(slide.offsetLeft - margin);
    }

    //Slides config
    slideConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            const postion = this.slidePosition(element);
            return { postion, element };
        });
    }

    slideIndexNav(index) {
        const lastSlide = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === lastSlide ? undefined : index + 1,
        };
    }

    changeSlide(index) {
        this.moveSlide(this.slideArray[index].postion);
        this.slideIndexNav(index);
        console.log(this.index);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slideConfig();
        return this;
    }
}