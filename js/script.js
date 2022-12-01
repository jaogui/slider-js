import { SlideNav } from "./slide.js";

const slide1 = new SlideNav(".slide", ".slide-wrapper");

slide1.init();
slide1.addArrow(".slide-prev", ".slide-next");

console.log(slide1);