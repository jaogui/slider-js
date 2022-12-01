import debounce from './debounce.js';

export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = {
            finalPosition: 0,
            startMouseX: 0,
            moviment: 0,
        };

        this.activeClass = 'slide-active';
        this.changeEvent = new Event('changeEvent');
    }

    transition(active) {
        this.slide.style.transition = active ? 'transform .3s ' : '';
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
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startMouseX = event.clientX;
            movetype = 'mousemove';
        } else {
            this.dist.startMouseX = event.changedTouches[0].clientX;
            movetype = 'touchmove';
        }
        this.wrapper.addEventListener(movetype, this.onMove);
        this.transition(false);
    }

    onMove(event) {
        const pointerPosition =
            event.type === 'mousemove' ?
            event.clientX :
            event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const movetype = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.moveFinal;
        this.changeSlideOnEnd();
        this.transition(true);
        // console.log("finaliza");
    }

    changeSlideOnEnd() {
        if (this.dist.moviment > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.dist.moviment < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active);
        }
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onEnd);
        this.wrapper.addEventListener('mouseup', this.onEnd);
    }

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
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
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.postion);
        this.slideIndexNav(index);
        this.dist.finalPosition = activeSlide.postion;
        this.changeActiveClass();
        this.wrapper.dispatchEvent(this.changeEvent);
    }

    changeActiveClass() {
        this.slideArray.forEach((slideItem) =>
            slideItem.element.classList.remove(this.activeClass)
        );
        this.slideArray[this.index.active].element.classList.add(this.activeClass);
    }

    activePrevSlide() {
        console.log(this.index.prev);
        if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
    }

    activeNextSlide() {
        if (this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    onResize() {
        // console.log("teste debounce");
        setTimeout(() => {
            this.slideConfig();
            this.changeSlide(this.index.active);
        }, 1000);
    }

    addResizeEvent() {
        window.addEventListener('resize', this.onResize);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);
        this.activePrevSlide = this.activePrevSlide.bind(this);
        this.onResize = debounce(this.onResize.bind(this), 50);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slideConfig();
        this.addResizeEvent();
        this.changeSlide(0);
        return this;
    }
}

export class SlideNav extends Slide {
    constructor(...args) {
        super(...args);
        this.bindControlEvent();
    }

    addArrow(prev, next) {
        this.prevElement = document.querySelector(prev);
        this.nextElement = document.querySelector(next);
        this.addArrowEvent();
    }

    addArrowEvent() {
        this.prevElement.addEventListener('click', this.activePrevSlide);

        this.nextElement.addEventListener('click', this.activeNextSlide);
    }

    createControl() {
        const control = document.createElement('ul');
        control.dataset.control = 'slide';

        this.slideArray.forEach((item, index) => {
            control.innerHTML += `<li> <a href="#slide${index + 1}">${
        index + 1
      } </a></li>`;
        });

        this.wrapper.appendChild(control);
        console.log(control);
        return control;
    }

    eventControl(item, index) {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            this.changeSlide(index);
            this.activeControlItem();
        });

        this.wrapper.addEventListener('changeEvent');
    }

    activeControlItem() {
        this.controlArray.forEach((item) =>
            item.classList.remove(this.activeClass)
        );

        this.controlArray[this.index.active].classList.add(this.activeClass);
    }

    addControl(custromControl) {
        this.control =
            document.querySelector(custromControl) || this.createControl();
        this.controlArray = [...this.control.children];
        this.controlArray.forEach(this.eventControl);
    }

    bindControlEvent() {
        this.eventControl = this.eventControl.bind(this);
    }
}